import { Repository, EntityRepository } from "typeorm";
import Earning from "../models/Earning";

interface EarningData {
  description: string;
  value: number;
  receiptDate: Date;
}

// O Decorator abaixo é pro typeorm sacar que a classe vai trabalhar com o banco de dados
@EntityRepository(Earning)
class EarningsRepository extends Repository<Earning> {

  public async createEarning(dados: EarningData): Promise<Earning> {

    const earning = this.create(dados)

    return await this.save(earning);
  }
}

export default EarningsRepository;
