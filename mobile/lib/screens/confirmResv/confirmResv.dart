import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'components/body.dart';

final dio = Dio();

class confirm extends StatelessWidget {
  static String routeName = "/confirm";

  @override
  Widget build(BuildContext context) {
    final confirmReservation args =
        ModalRoute.of(context)!.settings.arguments as confirmReservation;
    return Scaffold(
        body: Body(
      refCentre: args.refCentre,
      nomService: args.nomService,
      nomCentre: args.nomCentre,
    ));
  }
}

class confirmReservation {
  final String nomService;
  final String nomCentre;
  final int refCentre;
  final int? refResv;
  confirmReservation(
      {required this.refCentre,
      required this.nomService,
      required this.nomCentre,
      this.refResv});
}
