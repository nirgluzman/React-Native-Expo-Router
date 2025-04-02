//
// Data structure for a Video document in Firestore.
//

type Video = {
  creator: { username: string; photoURL: string }; // the user who created the video.
  title: string; // the title of the video.
  thumbnail: string; // URL or path to the video's thumbnail image.
  video: string; // URL or path to the video file.
  prompt: string; // text prompt (GenAI) associated with the video.
};

export type { Video };
