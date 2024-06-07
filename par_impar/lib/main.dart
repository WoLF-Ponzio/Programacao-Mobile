import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:par_impar/aposta.dart';
import 'package:par_impar/cadastro.dart';
import 'package:par_impar/lista.dart';
import 'package:par_impar/resultado.dart';

void main() {
  runApp(ParImpar());
}

class ParImpar extends StatefulWidget {
  @override
  State<ParImpar> createState() => ParImparState();
}

class ParImparState extends State<ParImpar> {
  var telaAtual = 0;
  var jogadorAtual = <String, dynamic>{};
  var oponente = <String, dynamic>{};
  var jogadores = <Map<String, dynamic>>[];

  // Endpoints
  final String baseUrl = 'https://par-impar.glitch.me';

  @override
  void initState() {
    super.initState();
    fetchJogadores();
  }

  Future<void> fetchJogadores() async {
    final response = await http.get(Uri.parse('$baseUrl/jogadores'));
    if (response.statusCode == 200) {
      setState(() {
        jogadores = List<Map<String, dynamic>>.from(json.decode(response.body)['jogadores']);
        // Adiciona um nome vazio para cada jogador, se não houver
        for (var jogador in jogadores) {
          if (jogador['username'] == null) {
            jogador['username'] = '';
          }
        }
      });
    } else {
      throw Exception('Failed to load jogadores');
    }
  }

  Future<void> cadastro(String nome) async {
    final response = await http.post(
      Uri.parse('$baseUrl/novo'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': nome}),
    );
    if (response.statusCode == 200) {
      jogadorAtual = {
        'nome': nome,
        'dedos': 1,
        'valorAposta': 0,
        'parImpar': 0,
        'pontos': 1000, // Pontos iniciais
      };
      setState(() {
        jogadores.add(jogadorAtual);
      });
      trocaTela(1);
    } else {
      throw Exception('Failed to register jogador');
    }
  }

  Future<void> aposta(String username, int valor, int parImpar, int numero) async {
    final response = await http.post(
      Uri.parse('$baseUrl/aposta'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'valor': valor,
        'parimpar': parImpar,
        'numero': numero,
      }),
    );
    if (response.statusCode == 200) {
      trocaTela(2);
    } else {
      throw Exception('Failed to place bet');
    }
  }

Future<Map<String, dynamic>> jogar(String username1, String username2) async {
  final response = await http.get(Uri.parse('$baseUrl/jogar/$username1/$username2'));
  if (response.statusCode == 200) {
    final resultado = json.decode(response.body);
    if (resultado.containsKey('msg') && resultado['msg'] == 'Ninguem ganhou!') {
      return {'msg': 'Ninguem ganhou!'};
    } else {
      setState(() {
        jogadorAtual['pontos'] = resultado['vencedor']['username'] == jogadorAtual['nome']
            ? jogadorAtual['pontos'] + int.parse(resultado['vencedor']['valor'].toString())
            : jogadorAtual['pontos'] - int.parse(resultado['perdedor']['valor'].toString());
        oponente['pontos'] = resultado['perdedor']['username'] == oponente['nome']
            ? oponente['pontos'] - int.parse(resultado['perdedor']['valor'].toString())
            : oponente['pontos'] + int.parse(resultado['vencedor']['valor'].toString());
      });
      return resultado;
    }
  } else {
    throw Exception('Failed to play game');
  }
}


  void trocaTela(int idNovaTela, [Map<String, dynamic>? jogador]) {
    setState(() {
      telaAtual = idNovaTela;
      if (jogador != null) {
        oponente = jogador;
      }
    });
  }

  Widget exibirTela() {
    if (telaAtual == 0) {
      return Cadastro(cadastro);
    } else if (telaAtual == 1) {
      return Aposta(trocaTela, jogadorAtual, aposta);
    } else if (telaAtual == 2) {
      return Lista(trocaTela, jogadores, jogadorAtual['nome']);
    } else {
      return Resultado(trocaTela, jogadorAtual, oponente, jogar);
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Par ou Ímpar',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: exibirTela(),
    );
  }
}
