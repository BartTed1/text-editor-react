import React from 'react';
import './Camera.scss';
import CameraUI from "./CameraUI";

class Camera extends React.Component {
    state= {
        isVisible: false
    }

    render () {
        return (
            <div>
                <input type="button" className="camera__button" onClick={this.onClick} />
                {this.state.isVisible ? <CameraUI callback={this.onCameraDoPhoto.bind(this)}/> : null}
            </div>
        )
    }

    private onClick = () => {
        if (!('mediaDevices' in navigator)) {
            alert('Your browser does not support media devices.');
            return;
        }
        this.setState({isVisible: true});
    }

    private onCameraDoPhoto = () => {
        alert('Photo taken');
    }
}

export default Camera;