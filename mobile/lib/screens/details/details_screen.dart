import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
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
        final response = await dio
            .get('http://192.168.1.39:5000/api/getIdEtab/${args.reference}');
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
        backgroundColor: Color(0xFFF5F6F9),
        appBar: PreferredSize(
          preferredSize: Size.fromHeight(AppBar().preferredSize.height),
          child: CustomAppBar(rating: 4),
        ),
        body: Body(reference: args.reference));
  }
}

class salonDetailsArguments {
  final int reference;

  salonDetailsArguments({required this.reference});
}
