import { copyFileSync, renameSync, unlinkSync } from "node:fs";

export interface MoveFs {
  renameSync: (src: string, dst: string) => void;
  copyFileSync: (src: string, dst: string) => void;
  unlinkSync: (path: string) => void;
}

const realFs: MoveFs = { renameSync, copyFileSync, unlinkSync };

/** Move a file; falls back to copy + unlink when rename crosses drives (EXDEV). Never loses the source if the copy fails. */
export function moveFileWith(fs: MoveFs, src: string, dst: string): void {
  try {
    fs.renameSync(src, dst);
    return;
  } catch (e) {
    if ((e as NodeJS.ErrnoException)?.code !== "EXDEV") throw e;
  }
  fs.copyFileSync(src, dst); // throws on failure; source untouched
  fs.unlinkSync(src);
}

export function moveFile(src: string, dst: string): void {
  moveFileWith(realFs, src, dst);
}
