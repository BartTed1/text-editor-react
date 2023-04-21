import React from 'react';
import './Camera.scss';

interface CameraUIProps {
    callback: Function;
}

class CameraUI extends React.Component<CameraUIProps> {
    state = {
        isPhotoTaken: false,
        image: ""
    }
    private readonly callback: Required<Function>;

    constructor(props: CameraUIProps) {
        super(props);
        this.callback = props.callback;
    }

    render () {
        return (
            <div className="cameraUI">
                <div className="videoPreview">
                    { !this.state.isPhotoTaken ?
                        <CameraPreview recordingCallback={this.recordingCallback} photoCallback={this.photoCallback} /> :
                        <PhotoPreview data={this.state.image}/>
                    }
                </div>
                <div className="cameraUI__buttons">
                    {this.state.isPhotoTaken ? "tak" : "nie"}
                </div>
            </div>
        )
    }

    private recordingCallback = (stream: MediaStream) => {

    }

    private photoCallback = (image: string) => {
        this.setState({isPhotoTaken: true, image: image})
    }
}

interface PhotoPreviewProps {
    data: string;
}

class PhotoPreview extends React.Component<PhotoPreviewProps> {
    private readonly data: Required<string>;
    constructor(props: PhotoPreviewProps) {
        super(props);
        this.data = props.data;
    }

    render() {
        console.log(this.data);
        return (
            <div className="cameraPreview">
                <img src={this.data} alt="photo" />
            </div>
        )
    }
}

interface CameraPreviewProps {
    recordingCallback: Function;
    photoCallback: Function;
}

class CameraPreview extends React.Component<CameraPreviewProps> {
    private readonly recordingCallback: Required<Function>;
    private readonly photoCallback: Required<Function>;
    private videoRef: React.RefObject<HTMLVideoElement> = React.createRef();
    constructor(props: CameraPreviewProps) {
        super(props);
        this.recordingCallback = props.recordingCallback;
        this.photoCallback = props.photoCallback;
    }
    render() {
        return (
            <div className="cameraPreview">
                <video id="video" width="100%" height="100%" autoPlay ref={this.videoRef}/>
                <button onClick={() => this.takePhoto()}>Do photo</button>
            </div>
        )
    }

    componentDidMount() {
        this.startCamera();
    }

    private async startCamera() {
        const video = this.videoRef.current;
        if (video) {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.play();
        }
    }

    private takePhoto() {
        const video = this.videoRef.current; // source of the photo
        if (video) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);

            const image = canvas.toDataURL('image/png');
            this.photoCallback(image);
        }
    }
}

export default CameraUI;