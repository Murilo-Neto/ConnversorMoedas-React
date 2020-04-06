import React, { useState } from 'react';
import './conversor-moedas.css';
import {Jumbotron, Button, Form, Col, Spinner, Alert, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import ListarMoedas from './listar-moedas';
import axios from 'axios';

function ConversorMoedas() {

  const FIXER_URL = 'http://data.fixer.io/api/latest?access_key=eba7130a5b2d720ce43eb5fcddd47cc3';

  const [valor, setValor] = useState('1');
  const [moedaDe, setMoedaDe] = useState('BRL');
  const [moedaPara, setMoedaPara] = useState('USD');
  const [exibirSpiner, setExiirSpiner] = useState (false);
  const [validaForm, setValidaForm] = useState (false);
  const [exibirModal, setExibirModal] = useState (false);
  const [resultadoConversao, setResultadoConversao] = useState ('');
  const [exibirMsgErro, setExibirMsgErro] = useState (false);


  function handleValor (event){
    setValor(event.target.value.replace(/\D/g,''));
  }

  function handleMoedaDe (event){
    setMoedaDe(event.target.value);
  }

  function handleMoedaPara (event){
    setMoedaPara(event.target.value);
  }

  function handleFechaModal(event) {
    setValor('1');
    setMoedaDe('BRL');
    setMoedaPara('USD');
    setValidaForm(false);
    setExibirModal(false);
  }

  function converter (event){
    event.preventDefault();
    setValidaForm(true);
    if (event.currentTarget.checkValidity() === true) {
      //TODO Implementar a Chamada ao Fixer.io
      setExibirModal(true);
      axios.get(FIXER_URL)
        .then(res => {
          const cotacao = obterCotacao(res.data);
          if(cotacao){
            setResultadoConversao(`${valor} ${moedaDe} = ${cotacao} ${moedaPara}`);
            setExibirModal(true);
            setExiirSpiner(false);
            setExibirMsgErro(false);
          }else {
            exibeErro();
          }
        }).catch(err => exibeErro);
    }
  }

  function obterCotacao(dadosCotacao) {
    if (!dadosCotacao || dadosCotacao.success !== true) {
      return false;
    }
    const cotacaoDe = dadosCotacao.rates[moedaDe];
    const cotacaoPara = dadosCotacao.rates[moedaPara];
    const cotacao = (1 / cotacaoDe * cotacaoPara) * valor;
    return cotacao.toFixed(2);
  }

  function exibeErro() {
    setExibirMsgErro(true);
    setExiirSpiner(false);

  }

  return (
    <div>
      <h1>Conversor de moedas</h1>
      <Alert variant="danger" show={exibirMsgErro}>
        Erro ao obter dados de conversão, tente novamente.
      </Alert>
      <Jumbotron>
          <Form onSubmit={converter} noValidate validated={validaForm}>
            <Form.Row>
              <Col sm="3">
                <Form.Control
                placeholder="0"
                value={valor}
                onChange={handleValor}
                required/>
              </Col>
              <Col sm="3">
                <Form.Control as="select"
                  value={moedaDe}
                  onChange={handleMoedaDe}>
                  <ListarMoedas />
                </Form.Control>
              </Col>
              <Col sm="1" className="text-center" style={{paddingTop:'5px'}}>
                <FontAwesomeIcon icon={faAngleDoubleRight} />
              </Col>
              <Col sm="3">
              <Form.Control as="select"
              value={moedaPara}
              onChange={handleMoedaPara}>
                <ListarMoedas />
              </Form.Control>
              </Col>
              <Col sm="2">
                <Button variant="success" type="submit" data-testid="btn-converter">
                <span className={exibirSpiner ? null : 'hidden'}>
                  <Spinner animation="border" size="sm" />
                </span>
                <span className={exibirSpiner ? 'hidden' : null}>
                  Converter
                </span>
                </Button>
              </Col>
            </Form.Row>
          </Form>
          <Modal show={exibirModal} onHide={handleFechaModal} data-testid="modal">
            <Modal.Header closeButton>
              <Modal.Title> Conversão</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {resultadoConversao}
            </Modal.Body>
            <Modal.Footer>
            <Button variant="success" onClick={handleFechaModal}>
              Nova Conversão
            </Button>
            </Modal.Footer>
          </Modal>
      </Jumbotron>
    </div>
  );
}

export default ConversorMoedas;
