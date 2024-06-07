import 'package:flutter/material.dart';

class Aposta extends StatefulWidget {
  final Function callback;
  final Map<String, dynamic> jogador;
  final Function realizarAposta;

  Aposta(this.callback, this.jogador, this.realizarAposta);

  @override
  State<StatefulWidget> createState() => ApostaState(callback, jogador, realizarAposta);
}

class ApostaState extends State<Aposta> {
  final Function callback;
  final Map<String, dynamic> jogador;
  final Function realizarAposta;
  int dedos = 1;
  int valorAposta = 0;
  int parImpar = 0;

  ApostaState(this.callback, this.jogador, this.realizarAposta);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Aposta ${jogador['nome']}'),),
      body: Column(children: [
        const Text("Escolha o número (1-5)"),
        Slider(
          label: "$dedos",
          min: 1,
          divisions: 5,
          max: 5,
          value: dedos.toDouble(),
          onChanged: (val) {
            setState(() {
              dedos = val.toInt();
            });
          },
        ),
        const Text("Valor da aposta"),
        Slider(
          label: "$valorAposta",
          min: 0,
          divisions: 10,
          max: 100,
          value: valorAposta.toDouble(),
          onChanged: (val) {
            setState(() {
              valorAposta = val.toInt();
            });
          },
        ),
        Row(children: [
          Radio(value: 2, groupValue: parImpar, onChanged: (int? value) {
            setState(() {
              parImpar = 2;
            });
          },),
          const Text('Par'),
          Radio(value: 1, groupValue: parImpar, onChanged: (int? value) {
            setState(() {
              parImpar = 1;
            });
          },),
          const Text('Impar')
        ],),
        ElevatedButton(
          child: const Text('Escolher Adversário'),
          onPressed: () {
            realizarAposta(jogador['nome'], valorAposta, parImpar, dedos);
          },
        ),
      ]),
    );
  }
}
