import React from 'react';
import {Composition} from 'remotion';
import {CielBleu} from './CielBleu';

export const FPS = 30;
export const RemotionRoot: React.FC = () => (
  <Composition id="CielBleu" component={CielBleu} durationInFrames={30 * FPS} fps={FPS} width={1080} height={1920} />
);
