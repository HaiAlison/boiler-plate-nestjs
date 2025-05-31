import { ImportsBaseFactory } from './imports-base.factory';
import { Workbook } from 'exceljs';
import { Recipient } from '../../entities/recipient.entity';

export class ImportsRecipientFactory extends ImportsBaseFactory {
  async handle(_dto: any, workbook: Workbook, user_id: any): Promise<void> {
    const worksheet = workbook.getWorksheet(1);
    const listUsers = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      const recipientData = Recipient.create({
        first_name: row.getCell(1).value?.toString() || '',
        last_name: row.getCell(2).value?.toString() || '',
        email:
          typeof row.getCell(3).value === 'object'
            ? row.getCell(3).value['text']
            : row.getCell(3).value?.toString() || '',
        user_id: user_id,
      });
      listUsers.push(Recipient.upsert(recipientData, ['email', 'user']));
    });
    await Promise.all(listUsers);
    return;
  }
}
