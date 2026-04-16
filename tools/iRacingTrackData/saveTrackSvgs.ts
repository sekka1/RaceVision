/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { IRacingClient } from './services/iracingClient';
import { TRACKS_PATH } from './constants';

interface TrackAsset {
  track_id: string;
  track_map: string;
  track_map_layers: { [key: string]: string };
}

async function saveTrack(
  iracingClient: IRacingClient,
  track: TrackAsset,
): Promise<{ trackId: string; failures: string[] }> {
  const trackPath = `${TRACKS_PATH}/${track.track_id}`;
  const failures: string[] = [];

  if (!existsSync(trackPath)) {
    mkdirSync(trackPath, { recursive: true });
  }

  for (const [, layer] of Object.entries(track.track_map_layers)) {
    try {
      const data = await IRacingClient.getTrackSvg(track.track_map, layer);
      writeFileSync(`${trackPath}/${layer}`, data, 'utf8');
    } catch (error) {
      failures.push(layer);
      console.error(
        `Failed to save SVG for track ${track.track_id} on layer ${layer}`,
      );
      // console.error(error);
    }
  }

  return { trackId: track.track_id, failures };
}

export const saveAllTrackSvgs = async (authToken: string) => {
  const tracks = readFileSync(`${TRACKS_PATH}/track-assets.json`, 'utf8');

  const allTracks: Record<string, TrackAsset> = JSON.parse(tracks);
  const iracingClient = new IRacingClient(authToken);

  const allFailures: Array<{ trackId: string; failures: string[] }> = [];

  // Use for...of instead of forEach to properly await async operations
  for (const track of Object.values(allTracks)) {
    const result = await saveTrack(iracingClient, track);
    if (result.failures.length > 0) {
      allFailures.push(result);
    }
  }

  if (allFailures.length > 0) {
    console.warn(
      `\nWarning: Failed to download some track SVG layers for ${allFailures.length} track(s):`,
    );
    allFailures.forEach(({ trackId, failures }) => {
      console.warn(`  Track ${trackId}: ${failures.join(', ')}`);
    });
    console.warn(
      '\nThis may be due to expired S3 URLs or missing layers in iRacing API.',
    );
    console.warn(
      'The workflow will continue, but some track maps may be incomplete.\n',
    );
  }

  console.info('Saved all track SVGs');
};
