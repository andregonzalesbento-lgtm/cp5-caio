// Página usada pelo time de estoque para acompanhar a quantidade de cada produto
export default function Estoque({ produtos, listaEspera = [] }) {
  // slice cria uma cópia, para o sort não alterar a lista original
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)

  const produtosComPreco = produtos.filter(
    (produto) => produto.price !== null && produto.price !== undefined && String(produto.price).trim() !== ''
  )

  const valorEmEstoque = produtosComPreco.reduce(
    (total, produto) => total + Number(produto.price) * Number(produto.estoque || 0),
    0
  )

  const esperandoPorProduto = listaEspera.reduce((acumulador, item) => {
    const produto = produtos.find((produtoAtual) => produtoAtual.id === item.produtoId)
    const nomeProduto = produto ? produto.title : 'Produto removido'
    acumulador.push({ ...item, nomeProduto })
    return acumulador
  }, [])

  const valorPorCategoria = produtosComPreco.reduce((acumulador, produto) => {
    const valor = Number(produto.price) * Number(produto.estoque || 0)
    acumulador[produto.category] = (acumulador[produto.category] || 0) + valor
    return acumulador
  }, {})

  const produtosSemPreco = produtos.filter(
    (produto) => produto.price === null || produto.price === undefined || String(produto.price).trim() === ''
  ).length

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Estoque</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>

      <div className="grade" style={{ marginBottom: '2rem' }}>
        <article className="card">
          <h3>Valor em estoque</h3>
          <p className="preco">R$ {valorEmEstoque.toFixed(2).replace('.', ',')}</p>
        </article>

        <article className="card">
          <h3>Esperando retorno</h3>
          <p className="preco">{listaEspera.length} clientes</p>
        </article>

        <article className="card">
          <h3>Sem preço definido</h3>
          <p className="preco">{produtosSemPreco} produtos</p>
        </article>
      </div>

      <div className="tabela-moldura" style={{ marginBottom: '2rem' }}>
        <table className="tabela">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Valor parado</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(valorPorCategoria).map(([categoria, valor]) => (
              <tr key={categoria}>
                <td>{categoria}</td>
                <td>R$ {Number(valor).toFixed(2).replace('.', ',')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.title}</td>
                <td>{produto.category}</td>
                <td>{produto.estoque}</td>
                <td>
                  {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                  {produto.estoque > 0 && produto.estoque < 5 && (
                    <span className="selo selo-alerta">Repor</span>
                  )}
                  {produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {esperandoPorProduto.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Lista de espera</h2>
          <div className="tabela-moldura">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                </tr>
              </thead>
              <tbody>
                {esperandoPorProduto.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nomeProduto}</td>
                    <td>{item.nome}</td>
                    <td>{item.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
