import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { async } from '@firebase/util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Equipamento } from '../equipamentos/models/equipamento.model';
import { EquipamentoService } from '../equipamentos/services/equipamento.service';
import { Funcionario } from '../funcionarios/models/funcionario.model';
import { FuncionarioService } from '../funcionarios/services/funcionario.service';
import { Requisicao } from './models/requisicao.model';
import { RequisicaoService } from './services/requisicao.service';

@Component({
  selector: 'app-requisicao',
  templateUrl: './requisicao.component.html'
})
export class RequisicaoComponent implements OnInit {
  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public funcionarios$: Observable<Funcionario[]>;
  public funcionarioLogado: Funcionario;
  public form: FormGroup;

  constructor(
    private requisicaoService: RequisicaoService,
    private departamentoService: DepartamentoService,
    private equipamentoService: EquipamentoService,
    private funcionarioService: FuncionarioService,
    private authService: AuthenticationService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(""),
      abertura: new FormControl(""),
      funcionarioId: new FormControl("", [Validators.required]),
      funcionario: new FormControl(""),
      departamentoId: new FormControl("", [Validators.required]),
      departamento: new FormControl(""),
      descricao: new FormControl("", [Validators.required, Validators.minLength(5)]),
      equipamentoId: new FormControl(""),
      equipamento: new FormControl("")
    });
    this.requisicoes$ = this.requisicaoService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();
    this.funcionarios$ =  this.funcionarioService.selecionarTodos();
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id(){
    return this.form.get("id");
  }

  get funcionarioId(){
    return this.form.get("funcionarioId");
  }

  get abertura(){
    return this.form.get("abertura");
  }

  get departamentoId(){
    return this.form.get("departamentoId");
  }

  get descricao(){
    return this.form.get("descricao");
  }

  get equipamentoId() {
    return this.form.get("equipamentoId");
  }

  obterFuncionarioLogado(){
    this.authService.usuarioLogado
      .subscribe(dados => {
        this.funcionarioService.selecionarFuncionarioLogado(dados!.email!)
          .subscribe(funcionario => {
            this.funcionarioLogado = funcionario;
            this.requisicoes$ = this.requisicaoService.selecionarTodos()
              .pipe(
                map(requisicoes => {
                  return requisicoes
                    .filter(r => r.funcionarioId === funcionario.id);
                })
              )
      })});
    }


  setValoresPadrao(){
    this.form.patchValue({
      solicitante: this.funcionarioLogado,
      status: 'Aberto',
      dataAbertura: new Date(),
      ultimaAtualizacao: new Date()
    })
  }


  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao){
    this.form.reset();

    if(requisicao){
      const departamento = requisicao.departamento ? requisicao.departamento : null;
      const equipamento = requisicao.equipamento ? requisicao.equipamento : null;
      const funcionario = requisicao.funcionario ? requisicao.funcionario : null;

      const requisicaoCompleta = {
        ...requisicao,
        departamento,
        equipamento,
        funcionario
      }
      this.form.setValue(requisicaoCompleta);
    }

    try {
      await this.modalService.open(modal).result;

      if(this.form.dirty && this.form.valid){
        if(!requisicao){
          this.abertura?.setValue(new Date());
          await this.requisicaoService.inserir(this.form.value);
        }
        else
          await this.requisicaoService.editar(this.form.value);

        this.toastrService.success(`A requisição foi salva com sucesso`, "Cadastro de Requisições");
      }
      else
        this.toastrService.info(`A requisição precisa ser preenchida!`, "Cadastro de Requisições");

    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
        this.toastrService.error(`Houve um erro ao salvar a requisção. Tente novamente.`, "Cadastro de Requisições");
    }
  }

  public excluir(requisicao: Requisicao){
    try {
      this.requisicaoService.excluir(requisicao);
      this.toastrService.success(`A requisição foi excluida com sucesso`, "Cadastro de Requisições");
    } catch (error) {
      this.toastrService.error(`Houve um erro ao salvar a requisição. Tente novamente.`, "Cadastro de Requisições");
    }
  }

}
