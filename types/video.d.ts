//
// Data structure representing the core attributes of a video, as stored in Firestore, but without the document identifier.
//

import { ImageSourcePropType } from 'react-native';

type Video = {
  creator: { username: string; photoURL: string }; // the user who created the video.
  title: string; // the title of the video.
  thumbnail: ImageSourcePropType; // URL or path to the video's thumbnail image.
  video: string; // URL or path to the video file.
  prompt: string; // text prompt (GenAI) associated with the video.
  timestamp: Date;
};

//
// Data structure representing a Video document retrieved from Firestore, including its unique document identifier.
//

type VideoWithId = Video & { id: string }; // extends Video with the Firestore document's identifier.

export type { Video, VideoWithId };
