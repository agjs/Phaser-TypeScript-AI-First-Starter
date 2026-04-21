/* eslint-disable */
// Example: the SAME concept, written badly. Do not write code like this.

// @ts-nocheck - this file is for illustration only
import Phaser from 'phaser'; //  ← rule #2: phaser in domain

interface PlayerState {
  position: { x: number; y: number };
  hp: number;
}

export const applyDamage = (scene: Phaser.Scene, state: PlayerState, amount: number) => {
  state.hp = state.hp - amount; //  ← mutates input
  if (state.hp < 0) {
    state.hp = 0;
  }
  if (Math.random() < 0.1) {
    //  ← non-deterministic; needs IRandomPort
    scene.sound.play('oof'); //  ← engine call from domain
  }
  if (Date.now() > 0) {
    //  ← wall-clock in domain; needs ITimePort
    console.log('damaged');
  }
};

// Why this is bad:
//  - Imports phaser in domain (lint error)
//  - Mutates its input (breaks referential transparency)
//  - Calls Math.random (non-deterministic)
//  - Calls Date.now (non-deterministic)
//  - Calls the audio system directly (side effect in domain)
//  - Cannot be tested without a real Phaser scene
