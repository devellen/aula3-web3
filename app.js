const express = require('express');
const mysql = require('mysql2');

const app = express();

const PORT = process.env.PORT || 5001;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'e7852',
    database: 'web3'
})

connection.connect((err) => {
    if (err) {
        console.error('erro ao conectar ao mysql ' + err.message);
    } else {
        console.log('conectado');
    }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//             ****************Categorias***********************

//rota para o metodo post para inserir categoria
app.post('/api/categorias', (req, res) => {
    const { nome, descricao } = req.body;

    //inserir dados na tabela
    const sql = 'INSERT INTO Categorias (nome, descricao) VALUES (?, ?)';
    connection.query(sql, [nome, descricao], (err, result) => {
        if (err) {
            console.error('erro ao inserir' + err.message);
            res.status(500).json({ error: 'erro ao inserir categoria' });
        } else {
            console.log('categoria inserida com sucesso');
            res.status(201).json({ message: 'categoria inserida!' });
        }
    });
});

//rota para o metodo get buscar categoria
app.get('/api/categorias', (req, res) => {
    const sql = 'SELECT * FROM Categorias';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('erro ao buscar categorias' + err.message);
            res.status(500).json({ error: 'erro ao buscar categorias' });
        } else {
            res.status(200).json(results);
        }
    });
});

//rota para o metodo put atualizar categoria
app.put('/api/categorias/:id', (req, res) => {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    //verifica se a categoria com o id digitado existe
    connection.query('SELECT * FROM Categorias WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('erro ao atualizar categoria' + err.message);
            res.status(500).json({ error: 'erro ao atualizar categoria' });
        } else {
            if (result.length === 0) {
                res.status(404).json({ error: 'Categoria não encontrada' });
            } else {
                //atualizar dados na tabela
                const sql = 'UPDATE Categorias SET nome = ?, descricao = ? WHERE id = ?';
                connection.query(sql, [nome, descricao, id], (err, result) => {
                    if (err) {
                        console.error('erro ao atualizar categoria' + err.message);
                        res.status(500).json({ error: 'erro ao atualizar categoria' });
                    } else {
                        console.log('categoria atualizado!')
                        res.status(200).json({ message: 'categoria atualizada com sucesso!' });
                    }
                });
            }
        }
    });
})

//rota para o metodo delete 
app.delete('/api/categorias/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Categorias WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('erro ao excluir registro, chave primaria etá sendo apontada em outra tabela' + err.message);
            res.status(500).json({ error: 'erro ao excluir registro, chave primaria etá sendo apontada em outra tabela' });
        } else {
            if (result.affectedRows > 0) {
                console.log('categoria excluida!')
                res.status(200).json({ message: 'categoria excluida com sucesso!' });
            } else {
                console.log('categoria não encontrada');
                res.status(404).json({ message: 'categoria não encontrada.' })
            }
        }
    });
})


//             *****************Produtos**********************

//rota para o metodo post para inserir produto
app.post('/api/produtos', (req, res) => {
    const { nome, descricao, preco, id_categoria, disponivel } = req.body;

    //inserir dados na tabela
    const sql = 'INSERT INTO Produtos (nome, descricao, preco, id_categoria, disponivel) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [nome, descricao, preco, id_categoria, disponivel], (err, result) => {
        if (err) {
            console.error('erro ao inserir' + err.message);
            res.status(500).json({ error: 'erro ao inserir produto' });
        } else {
            console.log('produto inserido com sucesso');
            res.status(201).json({ message: 'produto inserido!' });
        }
    });
});

//rota para buscar todos os produtos
app.get('/api/produtos', (req, res) => {
    const sql = 'SELECT * FROM Produtos';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('erro ao buscar produtos' + err.message);
            res.status(500).json({ error: 'erro ao buscar produtos' });
        } else {
            res.status(200).json(results);
        }
    });
});

//rota para buscar produto por nome
app.get('/api/produtos/:nome', (req, res) => {
    const { nome } = req.params;
    const sql = 'SELECT nome, descricao, preco, disponivel FROM produtos where nome like ?';
    const seachValue = `%${nome}%`
    connection.query(sql, seachValue, (err, results) => {
        if (err) {
            console.error('erro ao buscar produto' + err.message);
            res.status(500).json({ error: 'erro ao buscar produto' });
        } else {
            res.status(200).json(results);
        }
    });
});

//rota para atualizar produto
app.put('/api/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, id_categoria, disponivel } = req.body;

    //verifica se o produto com o id digitado existe
    connection.query('SELECT * FROM Produtos WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('erro ao atualizar produto' + err.message);
            res.status(500).json({ error: 'erro ao atualizar produto' });
        } else {
            if (result.length === 0) {
                res.status(404).json({ error: 'Produto não encontrado' });
            } else {
                //atualizar dados na tabela
                const sql = 'UPDATE Produtos SET nome = ?, descricao = ?, preco = ?, id_categoria = ?, disponivel = ? WHERE id = ?';
                connection.query(sql, [nome, descricao, preco, id_categoria, disponivel, id], (err, result) => {
                    if (err) {
                        console.error('erro ao atualizar produto' + err.message);
                        res.status(500).json({ error: 'erro ao atualizar produto' });
                    } else {
                        console.log('produto atualizado!')
                        res.status(200).json({ message: 'produto atualizado com sucesso!' });
                    }
                });
            }
        }
    });
})

//rota para o metodo delete 
app.delete('/api/produtos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Produtos WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('erro ao excluir produto.' + err.message);
            res.status(500).json({ error: 'erro ao excluir produto.' });
        } else {
            if (result.affectedRows > 0) {
                console.log('produto excluido!')
                res.status(200).json({ message: 'produto excluido com sucesso!' });
            } else {
                console.log('produto não encontrado');
                res.status(404).json({ message: 'produto não encontrado.' })
            }
        }
    });
})


//          *******************clientes***********************

app.post('/api/clientes', (req, res) => {
    const { nome, email, endereco, telefone } = req.body;

    //inserir dados na tabela
    const sql = 'INSERT INTO Clientes (nome, email, endereco, telefone) VALUES (?, ?, ?, ?)';
    connection.query(sql, [nome, email, endereco, telefone], (err) => {
        if (err) {
            console.error('erro ao inserir' + err.message);
            res.status(500).json({ error: 'erro ao inserir cliente' });
        } else {
            console.log('cliente inserido com sucesso');
            res.status(201).json({ message: 'cliente inserido!' });
        }
    });
});

//rota para buscar todos os clientes
app.get('/api/clientes', (req, res) => {
    const sql = 'SELECT * FROM Clientes';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('erro ao buscar cliente' + err.message);
            res.status(500).json({ error: 'erro ao buscar cliente' });
        } else {
            res.status(200).json(results);
        }
    });
});

//rota para buscar cliente por nome
app.get('/api/clientes/:nome', (req, res) => {
    const { nome } = req.params;
    const sql = 'SELECT * FROM clientes where nome like ?';
    const seachValue = `%${nome}%`
    connection.query(sql, seachValue, (err, results) => {
        if (err) {
            console.error('erro ao buscar cliente' + err.message);
            res.status(500).json({ error: 'erro ao buscar cliente' });
        } else {
            res.status(200).json(results);
        }
    });
});

//rota para atualizar cliente
app.put('/api/clientes/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, endereco, telefone } = req.body;
    //verifica se o cliente com o id digitado existe
    connection.query('SELECT * FROM Clientes WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('erro ao atualizar cliente' + err.message);
            res.status(500).json({ error: 'erro ao atualizar cliente' });
        } else {
            if (result.length === 0) {
                res.status(404).json({ error: 'Cliente não encontrado' });
            } else {
                //atualizar dados na tabela
                const sql = 'UPDATE Clientes SET nome = ?, email = ?, endereco = ?, telefone = ? WHERE id = ?';
                connection.query(sql, [nome, email, endereco, telefone, id], (err) => {
                    if (err) {
                        console.error('erro ao atualizar cliente' + err.message);
                        res.status(500).json({ error: 'erro ao atualizar cliente' });
                    } else {
                        console.log('cliente atualizado!')
                        res.status(200).json({ message: 'cliente atualizado com sucesso!' });
                    }
                });
            }
        }
    });
})

app.delete('/api/clientes/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Clientes WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('erro ao excluir cliente.' + err.message);
            res.status(500).json({ error: 'erro ao excluir cliente.' });
        } else {
            if (result.affectedRows > 0) {
                console.log('cliente excluido!')
                res.status(200).json({ message: 'cliente excluido com sucesso!' });
            } else {
                console.log('cliente não encontrado');
                res.status(404).json({ message: 'cliente não encontrado.' })
            }
        }
    });
})


//          *******************pedidos******************

app.post('/api/pedidos', (req, res) => {
    const { id_cliente, data_pedido, status } = req.body;

    //inserir dados na tabela
    const sql = 'INSERT INTO Pedidos (id_cliente, data_pedido, status) VALUES (?, ?, ?)';
    connection.query(sql, [id_cliente, data_pedido, status], (err) => {
        if (err) {
            console.error('erro ao inserir' + err.message);
            res.status(500).json({ error: 'erro ao inserir pedido' });
        } else {
            console.log('pedido inserido com sucesso');
            res.status(201).json({ message: 'pedido inserido!' });
        }
    });
});

//busca todos os pedidos
app.get('/api/pedidos', (req, res) => {
    const sql = 'SELECT * FROM Pedidos';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('erro ao buscar pedido' + err.message);
            res.status(500).json({ error: 'erro ao buscar pedido' });
        } else {
            res.status(200).json(results);
        }
    });
});

//buscar pedido pelo status (andamento, confirmado, cancelado, pendente, etc)
app.get('/api/pedidos/:status', (req, res) => {
    const { status } = req.params;
    const sql = 'SELECT * FROM pedidos where status like ?';
    const seachValue = `%${status}%`
    connection.query(sql, seachValue, (err, results) => {
        if (err) {
            console.error('erro ao buscar cliente' + err.message);
            res.status(500).json({ error: 'erro ao buscar cliente' });
        } else {
            res.status(200).json(results);
        }
    });
});

//rota para atualizar pedido
app.put('/api/pedidos/:id', (req, res) => {
    const { id } = req.params;
    const { id_cliente, data_pedido, status } = req.body;
    //verifica se o cliente com o id digitado existe
    connection.query('SELECT * FROM Pedidos WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('erro ao verificar pedido' + err.message);
            res.status(500).json({ error: 'erro ao verificar pedido' });
        } else {
            if (result.length === 0) {
                res.status(404).json({ error: 'Pedido não encontrado' });
            } else {
                //atualizar dados na tabela
                const sql = 'UPDATE Pedidos SET id_cliente = ?, data_pedido = ?, status = ? WHERE id = ?';
                connection.query(sql, [id_cliente, data_pedido, status, id], (err) => {
                    if (err) {
                        console.error('erro ao atualizar pedido' + err.message);
                        res.status(500).json({ error: 'erro ao atualizar pedido' });
                    } else {
                        console.log('pedido atualizado!')
                        res.status(200).json({ message: 'pedido atualizado com sucesso!' });
                    }
                });
            }
        }
    });
})

app.delete('/api/pedidos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Pedidos WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('erro ao excluir pedido.' + err.message);
            res.status(500).json({ error: 'erro ao excluir pedido.' });
        } else {
            if (result.affectedRows > 0) {
                console.log('pedido excluido!')
                res.status(200).json({ message: 'pedido excluido com sucesso!' });
            } else {
                console.log('pedido não encontrado');
                res.status(404).json({ message: 'pedido não encontrado.' })
            }
        }
    });
})

//         ******************Itens Pedidos********************

app.post('/api/itensPedidos', (req, res) => {
    const { id_pedido, id_produto, quantidade, preco_unitario } = req.body;

    //verifica a disponibilidade do produto antes de inserir nos itens pedidos
    connection.query('SELECT * FROM Produtos WHERE id = ? and disponivel=1', [id_produto], (err, result) => {
        if (err) {
            console.error('erro ao verificar disponibilidade' + err.message);
            res.status(500).json({ error: 'erro ao verificar disponibilidade' });
        } else {
            if (result.length === 0) {
                res.status(404).json({ error: 'produto não existente ou quantidade não disponivel' });
            } else {
                //inserir dados na tabela
                const sql = 'INSERT INTO ItensPedido (id_pedido, id_produto, quantidade, preco_unitario) VALUES (?, ?, ?, ?)';
                connection.query(sql, [id_pedido, id_produto, quantidade, preco_unitario], (err) => {
                    if (err) {
                        console.error('erro ao inserir' + err.message);
                        res.status(500).json({ error: 'erro ao inserir item' });
                    } else {
                        console.log('item inserido com sucesso');
                        res.status(201).json({ message: 'item inserido!' });
                    }
                });
            }
        }
    })

});

//busca todos os itens itens
app.get('/api/itensPedidos', (req, res) => {
    const sql = 'SELECT * FROM ItensPedido';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('erro ao buscar itens' + err.message);
            res.status(500).json({ error: 'erro ao buscar itens' });
        } else {
            res.status(200).json(results);
        }
    });
});

//rota para atualizar itens
app.put('/api/itensPedidos/:id', (req, res) => {
    const { id } = req.params;
    const { id_pedido, id_produto, quantidade, preco_unitario } = req.body;
    //verifica se o item com o id digitado existe
    connection.query('SELECT * FROM ItensPedido WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('erro ao verificar item' + err.message);
            res.status(500).json({ error: 'erro ao verificar item' });
        } else {
            if (result.length === 0) {
                res.status(404).json({ error: 'item pedido não encontrado' });
            } else {
                //atualizar dados na tabela
                const sql = 'UPDATE ItensPedido SET id_pedido = ?, id_produto = ?, quantidade = ?, preco_unitario = ?  WHERE id = ?';
                connection.query(sql, [id_pedido, id_produto, quantidade, preco_unitario, id], (err) => {
                    if (err) {
                        console.error('erro ao atualizar item' + err.message);
                        res.status(500).json({ error: 'erro ao atualizar item' });
                    } else {
                        console.log('item atualizado!')
                        res.status(200).json({ message: 'pedido atualizado com sucesso!' });
                    }
                });
            }
        }
    });
})

app.delete('/api/itensPedidos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM ItensPedido WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('erro ao excluir item pedido.' + err.message);
            res.status(500).json({ error: 'erro ao excluir item pedido.' });
        } else {
            if (result.affectedRows > 0) {
                console.log('item pedido excluido!')
                res.status(200).json({ message: 'item pedido excluido com sucesso!' });
            } else {
                console.log('item pedido não encontrado');
                res.status(404).json({ message: 'item pedido não encontrado.' })
            }
        }
    });
})

app.listen(PORT, console.log(`server started ${PORT}`));