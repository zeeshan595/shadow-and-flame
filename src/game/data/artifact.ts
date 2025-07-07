import { Card } from "./card";

export type Artifact = {
  uuid: string;
  name: string;
  description: string;

  onCard?(card: Card): Card;
  onTurn?(): void;
  onStart?(): void;
  onEnd?(): void;
};