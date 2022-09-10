import { Departamento } from "src/app/departamentos/models/departamento.model";
import { Equipamento } from "src/app/equipamentos/models/equipamento.model";
import { Funcionario } from "src/app/funcionarios/models/funcionario.model";

export class Requisicao{
  id: string;
  abertura: Date | any;
  descricao: string;

  atualizacao: Date | any;

  departamentoId: string;
  departamento?: Departamento;

  equipamentoId?: string;
  equipamento?: Equipamento;

  funcionarioId: string;
  funcionario?: Funcionario
}
