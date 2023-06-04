import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import '../../adresse.dart';
import 'components/body.dart';
import 'components/custom_app_bar.dart';
import '../../salon.dart';

final dio = Dio();

class DetailsScreen extends StatelessWidget {
  static String routeName = "/details";

  @override
  Widget build(BuildContext context) {
    final salonDetailsArguments args =
        ModalRoute.of(context)!.settings.arguments as salonDetailsArguments;
    Future<List<dynamic>> getItem() async {
      try {
        final response = await dio.get(
            'http://${Adresse.adresseIP}:5000/api/getIdEtab/${args.reference}');
        final dynamic data = response.data;
        print(data);
        if (data != null) {
          return data as List<dynamic>;
        } else {
          throw Exception('No data available.');
        }
      } catch (e) {
        throw Exception('Failed to get item: $e');
      }
    }

    return Scaffold(
        body: Body(reference: args.reference, nomCentre: args.nomCentre));
  }
}

class salonDetailsArguments {
  final int reference;
  final String nomCentre;
  salonDetailsArguments({required this.reference, required this.nomCentre});
}
