import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:shop_app/screens/MyResv/components/Body.dart';

final dio = Dio();

class MyResv extends StatelessWidget {
  static String routeName = "/MyResv";

  @override
  Widget build(BuildContext context) {
    final salonReservation args =
        ModalRoute.of(context)!.settings.arguments as salonReservation;
    return Scaffold(body: Body(CIN: args.CIN));
  }
}

class salonReservation {
  final int CIN;
  salonReservation({
    required this.CIN,
  });
}
