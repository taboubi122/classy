import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:shop_app/components/categories_menu.dart';
import 'package:shop_app/models/Product.dart';
import 'package:dio/dio.dart';
import '../../../components/service_menu.dart';
import '../../../constants.dart';
import '../../../size_config.dart';
import 'custom_app_bar.dart';

final dio = Dio();

class head extends StatelessWidget {
  const head({
    Key? key,
    required this.reference,
    required this.nomCentre,
    this.pressOnSeeMore,
  }) : super(key: key);

  final GestureTapCallback? pressOnSeeMore;
  final int reference;
  final String nomCentre;

  @override
  Widget build(BuildContext context) {
    Future<List<dynamic>> getItem() async {
      try {
        final response = await dio
            .get('http://192.168.1.39:5000/api/getIdEtab/${reference}');
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

    return FutureBuilder<List<dynamic>>(
      future: getItem(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return CircularProgressIndicator();
        } else if (snapshot.hasError) {
          return Text('Error: ${snapshot.error}');
        } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return Text('No salon data available');
        } else {
          final salonData = snapshot.data!;
          final salonItem = salonData[0];
          return afficherDonneesSalon(context, salonItem);
        }
      },
    );
  }

  Widget afficherDonneesSalon(BuildContext context, dynamic salonItem) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(
              horizontal: getProportionateScreenWidth(25),
              vertical: getProportionateScreenWidth(6)),
          child: Text(
            salonItem['type'],
          ),
        ),
        Padding(
          padding: EdgeInsets.only(
            left: getProportionateScreenWidth(25),
            right: getProportionateScreenWidth(64),
          ),
          child: Text(
            salonItem['nom'],
            style: TextStyle(fontSize: 12),
          ),
        ),
        Padding(
          padding: EdgeInsets.only(
            left: getProportionateScreenWidth(9),
            right: getProportionateScreenWidth(64),
          ),
          child: CustomAppBar(rating: 4.5),
        ),
      ],
    );
  }
}
