/// <reference types="next-video/video-types/global" />

declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}
