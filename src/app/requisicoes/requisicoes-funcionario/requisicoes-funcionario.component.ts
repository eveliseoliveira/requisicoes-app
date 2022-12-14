import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { DepartamentoService } from 'src/app/departamentos/services/departamento.service';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { EquipamentoService } from 'src/app/equipamentos/services/equipamento.service';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Requisicao } from '../models/requisicao.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
  selector: 'app-requisicoes-funcionario',
  templateUrl: './requisicoes-funcionario.component.html'
})
export class RequisicoesFuncionarioComponent implements OnInit, OnDestroy {

  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public funcionarios$: Observable<Funcionario[]>;

  public funcionarioLogado: Funcionario;
  private processoAutenticado$: Subscription;

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
      descricao: new FormControl(""),

      funcionarioId: new FormControl(""),
      funcionario: new FormControl(""),

      departamentoId: new FormControl(""),
      departamento: new FormControl(""),

      equipamentoId: new FormControl(""),
      equipamento: new FormControl(""),

      status: new FormControl(""),
      ultimaAtualizacao: new FormControl(""),
      movimentacoes: new FormControl("")
    });

    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();
    this.requisicoes$ = this.requisicaoService.selecionarTodos();

    this.processoAutenticado$ = this.authService.usuarioLogado.subscribe(usuario => {
      const email: string = usuario?.email!;

      this.funcionarioService.selecionarFuncionarioLogado(email)
        .subscribe(funcionario => this.funcionarioLogado =  funcionario);
    });
  }

  ngOnDestroy(): void {
    this.processoAutenticado$.unsubscribe();
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualiza????o" : "Cadastro";
  }

  get id(): AbstractControl | null{
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

  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao){
    this.form.reset();
    this.ConfigurarValoresPadrao();

    if(requisicao){
      const departamento = requisicao.departamento ? requisicao.departamento : null;
      const funcionario = requisicao.funcionario ? requisicao.funcionario : null;
      const equipamento = requisicao.equipamento ? requisicao.equipamento : null;

      const requisicaoCompleta = {
        ...requisicao,
        departamento,
        funcionario,
        equipamento

      }
      this.form.setValue(requisicaoCompleta);
    }

    try {
      await this.modalService.open(modal).result;

      if(this.form.dirty && this.form.valid){
        if(!requisicao){
          await this.requisicaoService.inserir(this.form.value);
        }
        else
          await this.requisicaoService.editar(this.form.value);

        this.toastrService.success(`A requisi????o foi salva com sucesso`, "Cadastro de Requisi????es");
      }
      else
        this.toastrService.info(`O formul??rio precisa ser preenchido!`, "Cadastro de Requisi????es");

    } catch (error) {
      if(error != "fechar" && error != "0" && error != "1")
        this.toastrService.error(`Houve um erro ao salvar a requis????o. Tente novamente.`, "Cadastro de Requisi????es");
    }

  }

  public excluir(requisicao: Requisicao){
    try {
      this.requisicaoService.excluir(requisicao);

      this.toastrService.success(`A requisi????o foi excluida com sucesso`, "Cadastro de Requisi????es");
    } catch (error) {
      this.toastrService.error(`Houve um erro ao salvar a requisi????o. Tente novamente.`, "Cadastro de Requisi????es");
    }
  }

  private ConfigurarValoresPadrao(): void{
    this.form.get("status")?.setValue("Aberta");
    this.form.get("abertura")?.setValue(new Date());
    this.form.get("ultimaAtualizacao")?.setValue(new Date());
    this.form.get("equipamentoId")?.setValue(null);
    this.form.get("funcionarioId")?.setValue(this.funcionarioLogado.id);
  }

}
