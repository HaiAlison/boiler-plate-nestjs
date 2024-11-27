import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        limits: {
          fileSize: parseInt(process.env.MAX_SIZE_PER_FILE_UPLOAD),
          files: parseInt(process.env.MAX_NUMBER_FILE_UPLOAD),
        },
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const filename: string = file.originalname;
            cb(null, filename);
          },
        }),
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {
}
