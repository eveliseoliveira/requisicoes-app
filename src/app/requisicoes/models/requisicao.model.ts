import { Departamento } from "src/app/departamentos/models/departamento.model";
import { Equipamento } from "src/app/equipamentos/models/equipamento.model";
import { Funcionario } from "src/app/funcionarios/models/funcionario.model";
import { Movimentacao } from "./movimentacao.model";

export class Requisicao{
  id: string;
  abertura: Date | any;
  descricao: string;

  departamentoId: string;
  departamento?: Departamento;

  equipamentoId?: string;
  equipamento?: Equipamento;

  funcionarioId: string;
  funcionario?: Funcionario

  ultimaAtualizacao: Date | any;
  status: string;
  movimentacoes: Movimentacao[]
}
