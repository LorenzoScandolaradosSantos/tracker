import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Cartao from '../components/Cartao';
import Botao from '../components/Botao';
import { cores, raio } from '../theme';
import {
  useAparelho,
  prepararBluetooth,
  iniciarBusca,
  pararBusca,
  conectarAparelho,
  desconectarAparelho,
  removerAparelho,
  atualizarAparelho,
  estimarDistancia,
} from '../bluetooth';

export default function Equipamento() {
  const aparelho = useAparelho();
  const [buscando, setBuscando] = useState(false);
  const [buscou, setBuscou] = useState(false);
  const [encontrados, setEncontrados] = useState([]);
  const [conectandoId, setConectandoId] = useState(null);
  const [erro, setErro] = useState(null);
  const timerRef = useRef(null);

  const conectado = aparelho ? aparelho.conectado : false;

  // Atualiza distância e bateria enquanto estiver conectado
  useEffect(() => {
    if (!conectado) return;
    const t = setInterval(atualizarAparelho, 8000);
    return () => clearInterval(t);
  }, [conectado]);

  // Para a busca ao sair da aba
  useEffect(() => () => {
    clearTimeout(timerRef.current);
    pararBusca();
  }, []);

  function parar() {
    clearTimeout(timerRef.current);
    pararBusca();
    setBuscando(false);
    setBuscou(true);
  }

  async function buscar() {
    setErro(null);
    setEncontrados([]);
    setBuscou(false);
    try {
      await prepararBluetooth();
      iniciarBusca(
        (d) => {
          const nome = d.name || d.localName;
          if (!nome) return;
          setEncontrados((lista) =>
            lista.some((x) => x.id === d.id) ? lista : [...lista, { id: d.id, nome, rssi: d.rssi }]
          );
        },
        (e) => {
          parar();
          setErro(e.message);
        }
      );
      setBuscando(true);
      timerRef.current = setTimeout(parar, 15000);
    } catch (e) {
      setErro(e.message);
    }
  }

  async function conectar(id, nome) {
    parar();
    setErro(null);
    setConectandoId(id);
    try {
      await conectarAparelho(id, nome);
      setEncontrados([]);
    } catch (e) {
      setErro('Não foi possível conectar. Aproxime o rastreador e tente novamente.');
    } finally {
      setConectandoId(null);
    }
  }

  return (
    <ScrollView contentContainerStyle={s.pad}>
      {aparelho ? (
        <Cartao>
          <View style={s.linha}>
            <View style={s.icone}>
              <Ionicons name="bluetooth" size={24} color={cores.destaque} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.nome}>{aparelho.nome}</Text>
              <Text style={s.suave}>
                {aparelho.conectado
                  ? `${estimarDistancia(aparelho.rssi)} · ${aparelho.bateria != null ? `${aparelho.bateria}%` : 'Bateria —'}`
                  : 'Fora de alcance ou desconectado'}
              </Text>
            </View>
            <View style={[s.status, !aparelho.conectado && s.statusOff]}>
              <View style={[s.ponto, !aparelho.conectado && s.pontoOff]} />
              <Text style={[s.statusTexto, !aparelho.conectado && s.statusTextoOff]}>
                {aparelho.conectado ? 'Conectado' : 'Desconectado'}
              </Text>
            </View>
          </View>

          <View style={s.acoes}>
            <Botao titulo="Tocar" variante="primario" style={s.acao} />
            <Botao
              titulo={
                aparelho.conectado
                  ? 'Desconectar'
                  : conectandoId === aparelho.id
                  ? 'Conectando...'
                  : 'Conectar'
              }
              style={s.acao}
              onPress={aparelho.conectado ? desconectarAparelho : () => conectar(aparelho.id, aparelho.nome)}
            />
            <Botao titulo="Remover" variante="perigo" style={s.acao} onPress={removerAparelho} />
          </View>
        </Cartao>
      ) : (
        <Cartao style={s.vazio}>
          <Ionicons name="bluetooth" size={32} color={cores.textoSuave} />
          <Text style={s.nome}>Nenhum equipamento</Text>
          <Botao
            titulo={buscando ? 'Parar busca' : 'Procurar rastreador'}
            variante="primario"
            style={s.procurar}
            onPress={buscando ? parar : buscar}
          />
        </Cartao>
      )}

      {erro && <Text style={s.erro}>{erro}</Text>}

      {!aparelho && (buscando || buscou || encontrados.length > 0) && (
        <View style={s.lista}>
          <View style={s.listaTopo}>
            <Text style={s.secao}>Aparelhos encontrados</Text>
            {buscando && <ActivityIndicator color={cores.destaque} />}
          </View>
          {encontrados.length === 0 && (
            <Text style={s.suave}>
              {buscando ? 'Procurando aparelhos próximos...' : 'Nenhum aparelho encontrado.'}
            </Text>
          )}
          {encontrados.map((d) => (
            <TouchableOpacity
              key={d.id}
              activeOpacity={0.7}
              disabled={conectandoId !== null}
              onPress={() => conectar(d.id, d.nome)}
            >
              <Cartao style={s.item}>
                <Ionicons name="bluetooth" size={20} color={cores.destaque} />
                <View style={{ flex: 1 }}>
                  <Text style={s.nome}>{d.nome}</Text>
                  <Text style={s.suave}>{estimarDistancia(d.rssi)}</Text>
                </View>
                {conectandoId === d.id ? (
                  <ActivityIndicator color={cores.destaque} />
                ) : (
                  <Text style={s.parear}>Parear</Text>
                )}
              </Cartao>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pad: { padding: 16 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icone: {
    width: 48,
    height: 48,
    borderRadius: raio.cartao,
    backgroundColor: cores.destaqueSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nome: { fontSize: 16, fontWeight: '700', color: cores.texto },
  suave: { marginTop: 2, fontSize: 13, color: cores.textoSuave },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: cores.sucessoSuave,
    borderRadius: raio.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusOff: { backgroundColor: cores.borda },
  ponto: { width: 7, height: 7, borderRadius: 4, backgroundColor: cores.sucesso },
  pontoOff: { backgroundColor: cores.textoSuave },
  statusTexto: { fontSize: 12, fontWeight: '600', color: cores.sucesso },
  statusTextoOff: { color: cores.textoSuave },
  acoes: { flexDirection: 'row', gap: 8, marginTop: 14 },
  acao: { flex: 1 },
  vazio: { alignItems: 'center', gap: 8 },
  procurar: { alignSelf: 'stretch', marginTop: 6 },
  erro: { color: cores.perigo, fontSize: 13, marginTop: 14 },
  lista: { marginTop: 18, gap: 8 },
  listaTopo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 4 },
  secao: { fontSize: 14, fontWeight: '700', color: cores.textoSuave },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  parear: { fontSize: 13, fontWeight: '700', color: cores.destaque },
});