import { EWSType, WSReceive, WSSend } from "../types/websocket.type";
import { rtcConfig } from "./peer";

interface User {
  username: string;
  peer: RTCPeerConnection;
  sendTrackMap: {
    [trackId: string]: RTCRtpSender;
  };
  streams: MediaStream[];
}

interface Users {
  [username: string]: User;
}

export interface ListMediaItem {
  username: string;
  stream?: MediaStream;
}
interface Options {
  ws: WebSocket;
  username: string;
  onMediaChange: (list: ListMediaItem[]) => void;
}
export class Rooms {
  private ws: WebSocket;
  private users: Users = {};
  private myMedia: MediaStream[] = [];
  private username: string;

  private onMediaChange: (list: ListMediaItem[]) => void;

  constructor({ ws, username, onMediaChange }: Options) {
    this.ws = ws;
    this.ws.addEventListener("message", (e) => this.onMessage(e));
    this.username = username;
    this.onMediaChange = onMediaChange;
    this.triggerMediaState();
  }

  destroy() {
    this.ws.removeEventListener("message", (e) => this.onMessage(e));
  }

  sendWs<T>(data: WSSend<T>) {
    const str = JSON.stringify(data);
    this.ws.send(str);
  }

  private onMessage(e: MessageEvent<string>) {
    const data = JSON.parse(e.data) as WSReceive<unknown>;
    switch (data.type) {
      case EWSType.EXISTING_USER_LIST:
        this.handleExistingUsers(data.content as string[]);
        break;

      case EWSType.NEW_USER:
        this.newUser(data.from);
        break;

      case EWSType.LEAVE:
        this.deleteUser(data.from);
        break;

      case EWSType.RTC_OFFER:
        this.handleOffer(data.from, data.content as RTCSessionDescription);
        break;

      case EWSType.RTC_ANSWER:
        this.handleAnswer(data.from, data.content as RTCSessionDescription);
        break;

      case EWSType.RTC_ICE_CANDIDATE:
        this.handleIceCandidate(data.from, data.content as RTCIceCandidateInit);
        break;
    }
  }

  private newUser(username: string) {
    console.log("New Participant: " + username);
    const peer = this.createPeer(username);
    console.log("New Peer");
    console.log(peer);
    const user: User = {
      username,
      peer,
      streams: [],
      sendTrackMap: {},
    };
    this.users[username] = user;
    this.triggerMediaState();
    this.sendMyMediaToUser(username);
  }

  private handleExistingUsers(usernameList: string[]) {
    for (const username of usernameList) {
      if (!this.users[username]) {
        this.newUser(username);
      }
    }
  }

  private createPeer(username: string): RTCPeerConnection {
    const peer = new RTCPeerConnection(rtcConfig);
    peer.onnegotiationneeded = () => this.onNegotiationNeeded(peer, username);
    peer.onicecandidate = (e) => this.onIceCandidate(username, e);
    peer.ontrack = (e) => this.onTrack(username, e);
    peer.onicecandidateerror = (e) => {
      console.log(e);
    };

    return peer;
  }

  private async onNegotiationNeeded(peer: RTCPeerConnection, username: string) {
    console.log("Negotiation Needed: " + username);
    try {
      const myOffer = await peer.createOffer();
      await peer.setLocalDescription(myOffer);
      this.sendWs({
        type: EWSType.RTC_OFFER,
        to: username,
        content: peer.localDescription,
      });
    } catch (error) {
      alert("Failed to create peer offer to " + username + "!");
    }
  }

  private async onIceCandidate(
    username: string,
    event: RTCPeerConnectionIceEvent
  ) {
    console.log("ICE Candidate: " + username);
    if (event.candidate) {
      this.sendWs({
        type: EWSType.RTC_ICE_CANDIDATE,
        to: username,
        content: event.candidate,
      });
    }
  }

  private onTrack(username: string, event: RTCTrackEvent) {
    console.log("Track: " + username);
    for (const stream of event.streams) {
      stream.addEventListener("removetrack", () => {
        this.users[username].streams = this.users[username].streams.filter(
          (item) => item.id !== stream.id
        );
        this.triggerMediaState();
      });
      this.users[username].streams = [
        ...this.users[username].streams.filter((s) => s.id !== stream.id),
        stream,
      ];
    }
    this.triggerMediaState();
  }

  private deleteUser(username: string) {
    this.users[username].peer.close();
    delete this.users[username];
    this.triggerMediaState();
  }

  private async handleOffer(
    fromUsername: string,
    offer: RTCSessionDescription
  ) {
    console.log("Receive Offer: " + fromUsername);
    console.log(offer);
    const find = this.users[fromUsername];
    var peer: RTCPeerConnection;
    if (!find) {
      peer = this.createPeer(fromUsername);

      const newUser: User = {
        username: fromUsername,
        peer,
        streams: [],
        sendTrackMap: {},
      };
      this.users[fromUsername] = newUser;
    } else {
      peer = find.peer;
    }
    await peer.setRemoteDescription(offer);

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    if (!find) {
      this.sendMyMediaToUser(fromUsername);
    }

    this.sendWs({
      type: EWSType.RTC_ANSWER,
      to: fromUsername,
      content: peer.localDescription,
    });
  }

  private async handleAnswer(
    fromUsername: string,
    answer: RTCSessionDescription
  ) {
    console.log("Receive Answer: " + fromUsername);
    const find = this.users[fromUsername];
    if (!find) return alert("Got RTC Answer but can't find peer!");

    await find.peer.setRemoteDescription(answer);
  }

  private async handleIceCandidate(
    fromUsername: string,
    candidate: RTCIceCandidateInit
  ) {
    console.log("Receive ICE Candidate: " + fromUsername);
    const find = this.users[fromUsername];
    if (!find) return alert("Got ICE Candidate but can't find peer!");

    await find.peer.addIceCandidate(candidate);
  }

  private sendMyMediaToUser(username: string) {
    for (const media of this.myMedia) {
      for (const track of media.getTracks()) {
        const sender = this.users[username].peer.addTrack(track, media);
        this.users[username].sendTrackMap[track.id] = sender;
      }
    }
  }

  private broadcastMyMedia(stream: MediaStream) {
    console.log("Media Broadcast!");
    for (const user of Object.values(this.users)) {
      for (const track of stream.getTracks()) {
        const sender = user.peer.addTrack(track, stream);
        this.users[user.username].sendTrackMap[track.id] = sender;
        console.log(user);
        console.log(sender);
      }
    }
  }

  addMyMedia(stream: MediaStream) {
    stream.getTracks()[0].onended = () => this.removeMyMedia(stream.id);
    this.broadcastMyMedia(stream);
    this.myMedia.push(stream);
    this.triggerMediaState();
  }

  private broadcastRemoveTrack(ids: string[]) {
    for (const user of Object.values(this.users)) {
      for (const id of ids) {
        const sender = user.sendTrackMap[id];
        user.peer.removeTrack(sender);
        delete this.users[user.username].sendTrackMap[id];
      }
    }
  }

  removeMyMedia(id: string) {
    const stream = this.myMedia.find((media) => media.id === id);
    if (stream) {
      this.broadcastRemoveTrack(stream.getTracks().map((item) => item.id));
      this.myMedia = this.myMedia.filter((it) => it.id !== id);
      this.triggerMediaState();
    }
  }

  private triggerMediaState() {
    console.log("Trigger Media Change!");
    const items: ListMediaItem[] = [];
    if (this.myMedia.length === 0) {
      items.push({
        username: this.username,
      });
    } else {
      for (const stream of this.myMedia) {
        items.push({
          username: this.username,
          stream: stream,
        });
      }
    }
    for (const user of Object.values(this.users)) {
      if (user.streams.length === 0) {
        items.push({
          username: user.username,
        });
      } else {
        for (const stream of user.streams) {
          items.push({
            username: user.username,
            stream: stream,
          });
        }
      }
    }

    this.onMediaChange(items);
  }
}
