import React, {RefObject} from 'react';
import FileDrop from '../FileDrop/FileDrop';
import './TextEdit.scss';

export enum FileTypes {
    IMAGE = "image/*",
    VIDEO = "video/*",
    AUDIO = "audio/*",
    TEXT = "text/*",
    PNG = "image/png",
    JPG = "image/jpeg",
    GIF = "image/gif",
    WEBP = "image/webp",
    MP4 = "video/mp4",
    DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    DOC = "application/msword",
    XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    XLS = "application/vnd.ms-excel",
    PDF = "application/pdf",
    HTML = "text/html",
    ZIP = "application/zip",
    JSON = "application/json"
}

export enum FileDropPlace {
    CURSOR = "cursor",
    END = "end"
}

export enum Mode {
    EDIT = "edit",
    NEW = "new"
}

/**
 * @param mode - enum Mode (optional, default: MODE.NEW) - The mode of the TextEdit component.
 * @param maxChars - number (optional, default: 500) - Maximum number of characters that can be entered.
 * @param fileDropMaxCount - number (optional, default: 1) - Maximum number of files that can be dropped.
 * @param fileDropAllowedTypes - array of enum FileTypes (optional, default: []) - Allowed file types. If not present, the component will not be implemented
 * @param fileDropSize - number (optional, default: 1024) - Maximum file size in KB.
 * @param fileDropPlace - enum FileDropPlace (optional, default: FileDropPlace.END) - The place where the file will be dropped.
 */
interface TextEditProps {
    mode?: Mode;
    maxLength?: number;
    maxAllowedFiles?: number;
    allowedFileTypes?: FileTypes[];
    maxFileSize?: number;
}

interface Media {
    [key: string]: File;
}

class TextEdit extends React.Component<TextEditProps> {
    state = {
        currentLength: 0,
        submitDisabled: true
    }
    private readonly mode: Required<Mode>;
    private readonly maxChars: Required<number>;
    private readonly fileDropMaxCount: Required<number>;
    private readonly fileDropAllowedTypes: Required<FileTypes[]>;
    private readonly fileDropSize: Required<number>;

    private media: Media = {};

    private counterRef: RefObject<HTMLSpanElement> = React.createRef();
    private fileDropRef: RefObject<FileDrop> = React.createRef();
    private filesContainerRef: RefObject<HTMLDivElement> = React.createRef();
    private textEditRef: RefObject<HTMLDivElement> = React.createRef();

    constructor(props: TextEditProps) {
        super(props);
        this.mode = props.mode ? props.mode : Mode.NEW;
        this.maxChars = props.maxLength ? props.maxLength : 500;
        this.fileDropMaxCount = props.maxAllowedFiles ? props.maxAllowedFiles : 1;
        this.fileDropAllowedTypes = props.allowedFileTypes ? props.allowedFileTypes : [];
        this.fileDropSize = props.maxFileSize ? props.maxFileSize * 1000 : 1024000; // from KB to B

        this.state.currentLength = 0;
    }

    render () {
        return (
            <div className="TextEdit">
                { this.mode === Mode.NEW ? <p>Nowy</p> : <p>Edytuj</p> }
                <div ref={this.textEditRef} placeholder="Zacznij pisać..." className="richText" suppressContentEditableWarning={true} contentEditable={true} onInput={this.onInput}>

                </div>
                <div ref={this.filesContainerRef} className="files-container"></div>
                <div className="bar">
                    <div>
                        { this.fileDropAllowedTypes.length > 0 ? <FileDrop ref={this.fileDropRef} className={"bar__elem"} maxSize={this.fileDropSize} allowedCount={this.fileDropMaxCount} allowedType={this.fileDropAllowedTypes} callback={this.handleFilesAdd.bind(this)}></FileDrop> : "" }
                    </div>
                    <div>
                        { this.maxChars !== Infinity ? <span className={"counter"} ref={this.counterRef}>{this.state.currentLength}/{this.maxChars}</span> : "" }
                        <button disabled={this.state.submitDisabled} className={"bar__submit"} type={"button"} onClick={this.onSubmit}>Zapisz</button>
                    </div>

                </div>
            </div>
        )
    }

    private onFileRemove = (event: Event, element: HTMLDivElement) => {
        event.stopPropagation();
        delete this.media[element.dataset.name as string];
        element.remove();
        this.fileDropRef.current?.onFileRemove();
    }

    private srcToImgPreview = (src: string, name: string) => {
        const img = document.createElement('img');
        img.classList.add('file-container__image');
        img.src = src;
        const container = document.createElement('div');
        container.classList.add('file-container');
        container.setAttribute("data-type", "image");
        container.setAttribute("data-name", name);
        const closeButton = document.createElement('input');
        closeButton.type = 'button';
        closeButton.classList.add('file-container__button--delete');
        closeButton.addEventListener('click', (event) => {
            this.onFileRemove(event, container);
        });
        container.appendChild(closeButton);
        container.appendChild(img);
        return container;
    }

    private removeStyleAttr = (element: HTMLElement) => {
        for(const child of element.children) {
            child.removeAttribute('style');
            if (child.children.length > 0) this.removeStyleAttr(child as HTMLElement);
        }
    }

    private onInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
        this.removeStyleAttr(event.currentTarget);
        this.setState({currentLength: event.currentTarget.innerText.length})
        if (event.currentTarget.innerText.length > this.maxChars) {
            event.currentTarget.classList.add('textedit--over-limit');
            this.counterRef.current?.classList.add('counter--over-limit');
            this.setState({submitDisabled: true});
        } else {
            event.currentTarget.classList.remove('textedit--over-limit');
            this.counterRef.current?.classList.remove('counter--over-limit');
            this.setState({submitDisabled: false});
        }

        if (event.currentTarget.innerText === "" || event.currentTarget.innerText === "\n") {
            this.setState({submitDisabled: true});
        }
    }

    private onSubmit = () => {
        const content = {
            text: this.textEditRef.current?.innerText,
            media: this.media
        }
        // TODO: send content to server
    }

    private srcToFilePreview = (src: string, type: string, name: string) => {
        const a = document.createElement('a');
        a.classList.add('file-container__link');
        a.href = src;
        a.download = name;
        a.innerText = name;

        const container = document.createElement('div');
        container.classList.add('file-container__file');
        container.setAttribute("data-type", type);
        container.setAttribute("data-name", name);
        container.addEventListener("click", () => {
            a.click();
        });

        const closeButton = document.createElement('input');
        closeButton.type = 'button';
        closeButton.classList.add('file-container__button--delete');
        closeButton.addEventListener('click', (event) => {
            this.onFileRemove(event, container);
        });

        container.appendChild(closeButton);
        container.appendChild(a);
        return container;
    }

    private handleFilesAdd = (files: File[]) => {
        for (const file of files) {
            if (file.type.includes("image")) {
                // file save
                this.media[file.name] = file;

                // file preview
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const preview = this.srcToImgPreview(reader.result as string, file.name);
                    this.filesContainerRef.current?.appendChild(preview);
                }
            }
            else if (file.type.includes("video")) {
                // TODO handle videos
                // file save
                this.media[file.name] = file;

                // file preview
                const video = document.createElement('video');
                video.classList.add('file-container__video');
                video.src = URL.createObjectURL(file);
                video.controls = true;
                const container = document.createElement('div');
                container.classList.add('file-container');
                container.setAttribute("data-type", "video");
                container.setAttribute("data-name", file.name);
                const closeButton = document.createElement('input');
                closeButton.type = 'button';
                closeButton.classList.add('file-container__button--delete');
                closeButton.addEventListener('click', (event) => {
                    this.onFileRemove(event, container);
                });
                container.appendChild(closeButton);
                container.appendChild(video);
                this.filesContainerRef.current?.appendChild(container);
            }
            else {
                // file save
                this.media[file.name] = file;
                console.log(this.media[file.name]);

                // file preview
                const preview = this.srcToFilePreview(URL.createObjectURL(file), file.type, file.name);
                this.filesContainerRef.current?.appendChild(preview);
            }
        }
    }
}

export default TextEdit;