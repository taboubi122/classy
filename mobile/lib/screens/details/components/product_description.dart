import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:shop_app/models/Product.dart';
import 'package:dio/dio.dart';
import '../../../constants.dart';
import '../../../size_config.dart';

final dio = Dio();

class ProductDescription extends StatelessWidget {
  const ProductDescription({
    Key? key,
    required this.reference,
    this.pressOnSeeMore,
  }) : super(key: key);

  final GestureTapCallback? pressOnSeeMore;
  final int reference;

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
          padding:
              EdgeInsets.symmetric(horizontal: getProportionateScreenWidth(20)),
          child: Text(
            salonItem['nom'],
            style: Theme.of(context).textTheme.headline6,
          ),
        ),
        Align(
          alignment: Alignment.centerRight,
          child: Container(
            padding: EdgeInsets.all(getProportionateScreenWidth(15)),
            width: getProportionateScreenWidth(64),
            decoration: BoxDecoration(
              color: Color(0xFFFFE6E6),
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(20),
                bottomLeft: Radius.circular(20),
              ),
            ),
            child: SvgPicture.asset(
              "assets/icons/Heart Icon_2.svg",
              color: Color(0xFFFF4848),
              height: getProportionateScreenWidth(16),
            ),
          ),
        ),
        Padding(
          padding: EdgeInsets.only(
            left: getProportionateScreenWidth(20),
            right: getProportionateScreenWidth(64),
          ),
          child: Text(
            salonItem['type'],
            maxLines: 3,
          ),
        ),
        Padding(
          padding: EdgeInsets.symmetric(
            horizontal: getProportionateScreenWidth(20),
            vertical: 10,
          ),
          child: GestureDetector(
            onTap: () {},
            child: Row(
              children: [
                Text(
                  "See More Detail",
                  style: TextStyle(
                      fontWeight: FontWeight.w600, color: kPrimaryColor),
                ),
                SizedBox(width: 5),
                Icon(
                  Icons.arrow_forward_ios,
                  size: 12,
                  color: kPrimaryColor,
                ),
              ],
            ),
          ),
        )
      ],
    );
  }
}
