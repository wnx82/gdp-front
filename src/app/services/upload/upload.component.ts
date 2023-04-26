import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
    selectedFile: File | undefined;

    images: string[] = [];

    constructor(private http: HttpClient) {}

    readonly API_URL = `${environment.apiUrl}/upload`;
    readonly API_URL_UPLOADS = `${environment.apiUrl}/uploads`;

    ngOnInit(): void {
        this.http.get<string[]>(`${this.API_URL_UPLOADS}`).subscribe(images => {
            this.images = images;
        });
    }
    onFileSelected(event: any): void {
        console.log('File selected:', event.files);
        this.selectedFile = event.files[0];
    }

    onUpload(): void {
        console.log('File uploaded successfully!');
        alert('File uploaded successfully!');
    }

    uploadFile(): void {
        if (this.selectedFile) {
            console.log('Uploading file:', this.selectedFile);
            const formData = new FormData();
            formData.append('file', this.selectedFile, this.selectedFile.name);
            this.http.post(this.API_URL, formData).subscribe(res => {
                console.log('Upload response:', res);
            });
        } else {
            console.log('No file selected');
        }
    }
}
