import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

import 'components/body.dart';

final dio = Dio();

class reservation extends StatelessWidget {
  static String routeName = "/reservation";

  @override
  Widget build(BuildContext context) {
    final salonReservation args =
        ModalRoute.of(context)!.settings.arguments as salonReservation;
    return Scaffold(
        body: Body(
      refCentre: args.refCentre,
      nomService: args.nomService,
      nomCentre: args.nomCentre,
    ));
  }
}

class salonReservation {
  final String nomService;
  final String nomCentre;
  final int refCentre;
  salonReservation(
      {required this.refCentre,
      required this.nomService,
      required this.nomCentre});
}
