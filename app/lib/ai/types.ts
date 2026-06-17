import { TailorMode } from "./prompts/modes/modes";

export type TailorInput = {
  resume: string;
  jobDescription: string;
  mode?: TailorMode;
};
