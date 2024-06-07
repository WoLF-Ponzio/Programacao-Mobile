import 'package:flutter/material.dart';

class Lista extends StatelessWidget {
  final Function callback;
  final List<Map<String, dynamic>> jogadores;
  final String jogadorAtual;

  Lista(this.callback, this.jogadores, this.jogadorAtual);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Lista de Jogadores'),),
      body: ListView.builder(
        itemCount: jogadores.length,
        itemBuilder: (context, index) {
          final jogador = jogadores[index];
          if (jogador['username'] == null || jogador['username'] == jogadorAtual) {
            return Container(); // Não exibe jogadores sem nome ou o jogador atual
          }
          return ListTile(
            title: Text(jogador['username'] ?? 'Sem Nome'),
            onTap: () {
              callback(3, jogador); // Passa o jogador selecionado para a tela de resultado
            },
          );
        },
      ),
    );
  }
}
