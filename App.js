import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider, useApp } from './src/context/AppContext';
import BarraNavegacao from './src/components/BarraNavegacao';
import BotaoIA from './src/components/BotaoIA';
import Inicio from './src/screens/Inicio';
import Radar from './src/screens/Radar';
import Configuracoes from './src/screens/Configuracoes';
import Descricao from './src/screens/Descricao';
import Assistente from './src/screens/Assistente';
import { cores, fonte } from './src/theme';

const TITULOS = {
  inicio: 'TRACKER',
  radar: 'ADICIONAR TAG',
  config: 'CONFIGURAÇÕES',
  ajuda: 'COMO USAR',
  assistente: 'Assistente',
};
const ABAS = ['inicio', 'radar'];

function Raiz() {
  const { anunciar } = useApp();
  const [tela, setTela] = useState('inicio');
  const [chaveIA, setChaveIA] = useState(0); // força reabrir o assistente e ouvir de novo

  const irPara = (destino) => {
    setTela(destino);
    if (destino !== 'assistente') anunciar(TITULOS[destino]);
  };
  const abrirIA = () => {
    setChaveIA((k) => k + 1);
    setTela('assistente');
  };

  const secundaria = !ABAS.includes(tela);

  return (
    <View style={s.root}>
      <View style={s.header}>
        {secundaria && (
          <TouchableOpacity style={[s.iconeHeader, { left: 8 }]} onPress={() => irPara('inicio')} accessibilityRole="button" accessibilityLabel="Voltar">
            <Ionicons name="arrow-back" size={32} color={cores.preto} />
          </TouchableOpacity>
        )}
        <Text style={s.titulo} accessibilityRole="header">{TITULOS[tela]}</Text>
        {tela === 'inicio' && (
          <View style={[s.iconeHeader, { right: 8, flexDirection: 'row' }]}>
            <TouchableOpacity style={s.hit} onPress={() => irPara('ajuda')} accessibilityRole="button" accessibilityLabel="Como usar">
              <Ionicons name="help-circle-outline" size={34} color={cores.preto} />
            </TouchableOpacity>
            <TouchableOpacity style={s.hit} onPress={() => irPara('config')} accessibilityRole="button" accessibilityLabel="Configurações">
              <Ionicons name="settings-outline" size={32} color={cores.preto} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={s.corpo}>
        {tela === 'inicio' && <Inicio irPara={irPara} />}
        {tela === 'radar' && <Radar />}
        {tela === 'config' && <Configuracoes />}
        {tela === 'ajuda' && <Descricao irPara={(d) => (d === 'assistente' ? abrirIA() : irPara(d))} />}
        {tela === 'assistente' && <Assistente key={chaveIA} iniciarComVoz />}
        {tela !== 'assistente' && <BotaoIA onPress={abrirIA} />}
      </View>

      <BarraNavegacao atual={tela} onSelecionar={irPara} />
    </View>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Raiz />
    </AppProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: cores.branco, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50 },
  header: { minHeight: 64, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.branco },
  titulo: { fontSize: fonte.titulo + 2, fontWeight: '900', color: cores.preto },
  iconeHeader: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  hit: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  corpo: { flex: 1, backgroundColor: cores.amarelo },
});
