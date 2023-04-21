import React, { RefObject } from 'react';
import './FileDrop.scss';

interface FileDropProps {
    maxSize: number;
    allowedCount: number;
    allowedType: Array<string>;
    callback: Function;
    className?: string;
}

class FileDrop extends React.Component<FileDropProps> {
    private readonly maxFileSize: Required<number>;
    private readonly maxAllowedFiles: Required<number> = 0;
    private usedLimit: number = 0;
    private allowedTypes: Required<Array<string>> = [];
    private readonly onFilesAdded: Required<Function>;
    private readonly className: string = "";

    private fileInput: RefObject<HTMLInputElement> = React.createRef();

    constructor(props: FileDropProps) {
        super(props);
        this.maxFileSize = props.maxSize;
        this.maxAllowedFiles = props.allowedCount;
        this.allowedTypes = props.allowedType;
        this.onFilesAdded = props.callback;
        this.className = props.className ? props.className : "";
    }

    render() {
        return (
            <div>
            <input type="button" className={`FileDrop ${this.className}`} onClick={this.onClick} />
            { this.maxAllowedFiles > 1 ?
                (
                    <input type="file" multiple accept={this.allowedTypes.join(',')} ref={this.fileInput} hidden onChange={this.onAddFiles} />
                ) : (
                    <input type="file" accept={this.allowedTypes.join(',')} ref={this.fileInput} hidden onChange={this.onAddFiles} />
                )
            }
            </div>
        );

    }

    private onClick = () => {
        this.fileInput.current?.click();
    }

    private onAddFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || !this.onFilesAdded) return;

        if (files.length + this.usedLimit > this.maxAllowedFiles || this.usedLimit >= this.maxAllowedFiles) {
            alert(`Możesz dodać maksymalnie ${this.maxAllowedFiles} plików, wcześniej dodano ${this.usedLimit}, teraz dodajesz ${files.length}`);
            return;
        }
        for(const file of files) {
            if (file.size > this.maxFileSize) {
                alert(`Plik ${file.name} jest za duży. Maksymalny rozmiar pliku to ${this.maxFileSize / 1000} kB`);
                return;
            }
        }
        this.usedLimit += files.length;
        this.onFilesAdded(files);
        event.target.value = '';
    }

    public onFileRemove = () => {
        this.usedLimit -= 1;
    }
}

// function Translate() {
//   return (WrappedComponent: any) => {
//     return class extends React.Component {
//       render() {
//         return <WrappedComponent {...this.props} />;
//       }
//     };
//   };
// }


export default /*Translate()(*/FileDrop/*)*/;