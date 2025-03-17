import { ImportsBaseFactory } from './imports-base.factory';
import { ImportsRecipientFactory } from './imports-recipient.factory';
import { DataSource } from 'typeorm';

export enum ImportType {
  RECIPIENT = 'recipient',
}

export class ImportsFactory {
  async instance(
    type: ImportType,
    dataSource: DataSource,
  ): Promise<ImportsBaseFactory> {
    switch (type) {
      case ImportType.RECIPIENT:
        return new ImportsRecipientFactory();
      default:
        throw new Error('Invalid import type');
    }
  }
}
