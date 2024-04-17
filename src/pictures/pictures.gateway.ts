import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { PicturesService } from './pictures.service';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';

@WebSocketGateway()
export class PicturesGateway {
  constructor(private readonly picturesService: PicturesService) {}

  @SubscribeMessage('createPicture')
  create(@MessageBody() createPictureDto: CreatePictureDto) {
    return this.picturesService.create(createPictureDto);
  }

  @SubscribeMessage('findAllPictures')
  findAll() {
    return this.picturesService.findAll();
  }

  @SubscribeMessage('findOnePicture')
  findOne(@MessageBody() id: number) {
    return this.picturesService.findOne(id);
  }

  @SubscribeMessage('updatePicture')
  update(@MessageBody() updatePictureDto: UpdatePictureDto) {
    return this.picturesService.update(updatePictureDto.id, updatePictureDto);
  }

  @SubscribeMessage('removePicture')
  remove(@MessageBody() id: number) {
    return this.picturesService.remove(id);
  }
}
