# 이미지 최적화 및 S3 업로드

#### 스택

Python, Pillow, Numpy, Boto3, Bria 1.4(배경제거 모델)

```md
image-resize
├── components
│ ├── bg_remover: CV 모델 활용 이미지 배경 제거
│ ├── image_resizer: 이미지 리사이징 및 webp 확장자 변경
│ ├── s3_uploader: s3에 이미지 업로드 및 업데이트
│  
├── test
│ ├── test_bg_remover
│ ├── test_image_resizer
│ └── test_s3_uploader
```
