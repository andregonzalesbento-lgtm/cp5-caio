import { Link, useParams } from 'react-router'
import { useState } from 'react'
import { podeAdicionarAoCarrinho } from '../utils/carrinho'

export default function PaginaProduto({ produtos, onAdicionar, onRegistrarEspera, listaEspera = [] }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagemEspera, setMensagemEspera] = useState('')

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const precoValido =
    produto.price !== null &&
    produto.price !== undefined &&
    String(produto.price).trim() !== '' &&
    Number.isFinite(Number(produto.price))

  if (!precoValido) {
    return (
      <div className="estado-vazio">
        <p>Este produto está indisponível no momento.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const relacionados = produtos
    .filter((item) => item.category === produto.category && item.id !== produto.id)
    .slice(0, 4)

  const esgotado = produto.estoque === 0

  function enviarAlerta(evento) {
    evento.preventDefault()

    if (!nome.trim() || !email.trim()) {
      return
    }

    onRegistrarEspera({ produtoId: produto.id, nome: nome.trim(), email: email.trim() })
    setNome('')
    setEmail('')
    setMensagemEspera('Recebemos seu aviso. Vamos te notificar quando o produto voltar.')
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">R$ {Number(produto.price).toFixed(2).replace('.', ',')}</p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>

          <button
            type="button"
            className="botao botao-grande"
            onClick={() => onAdicionar(produto)}
            disabled={!podeAdicionarAoCarrinho(produto)}
          >
            {esgotado ? 'Produto esgotado' : 'Adicionar ao carrinho'}
          </button>

          {esgotado && (
            <form className="cupom" onSubmit={enviarAlerta}>
              <label className="rotulo" htmlFor="aviso-preco">
                Avise-me quando voltar
              </label>
              <input
                id="aviso-preco"
                type="text"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                placeholder="Seu nome"
              />
              <input
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                placeholder="Seu e-mail"
              />
              <button className="botao botao-secundario" type="submit">
                Quero ser avisado
              </button>
              {mensagemEspera && <p className="mensagem-cupom">{mensagemEspera}</p>}
            </form>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">R$ {Number(item.price).toFixed(2).replace('.', ',')}</p>
            <button
              type="button"
              className="botao"
              onClick={() => onAdicionar(item)}
              disabled={!podeAdicionarAoCarrinho(item)}
            >
              {item.estoque === 0 ? 'Esgotado' : 'Adicionar ao carrinho'}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
