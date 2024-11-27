import { Injectable } from '@nestjs/common';
import { Upload } from '../entities/Upload.entity';
import { handleError, pagination } from '../utils/common/handle';
import { CommonDto } from '../utils/common/dto';

@Injectable()
export class UploadService {
  async uploadFile(dto: any, images: Express.Multer.File[], id: string) {
    try {
      const promiseUploads = [];
      for (const image of images) {
        const upload = Upload.create({
          user_id: id,
          full_url: image.path,
          name: image.originalname,
          key: image.filename,
        });
        promiseUploads.push(upload.save());
      }
      await Promise.all(promiseUploads);
      return { message: 'Upload thành công' };
    } catch (e) {
      handleError(e);
    }
  }

  async getImages(dto: CommonDto, user_id: string) {
    const query = Upload.createQueryBuilder('upload').where(
      'user_id = :user_id',
      { user_id },
    );
    return await pagination(query, dto);
  }

  async deleteImage(id: string) {
    try {
      const upload = await Upload.findOneOrFail({ where: { id } });
      await upload.remove();
      return { message: 'Xóa thành công' };
    } catch (e) {
      handleError(e);
    }
  }
}
