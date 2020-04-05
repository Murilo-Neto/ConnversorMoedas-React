import React from 'react';
import ReactDOM from 'react-dom';
import ListarMoeads from './listar-moedas';

describe('teste do componente de listagem de moedas', () =>{

  it('Deve renderizar o componente sem erros', () => {
    const div = document.creatElemennt('div');
    ReactDOM.render(<ListarMoeads />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

});
