import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

import '../../../adresse.dart';
import '../../../salon.dart';
import '../../../size_config.dart';
import '../../details/details_screen.dart';
import '../../seeMoreCentre/seeMoreCentre.dart';
import 'section_title.dart';

final dio = Dio();

class SpecialOffers extends StatelessWidget {
  const SpecialOffers({
    Key? key,
  }) : super(key: key);

  Future<List<salon>> getItems() async {
    try {
      final response =
          await dio.get('http://${Adresse.adresseIP}:5000/api/getNamesEtab');
      final List<dynamic> data = response.data;
      final items = data
          .map((itemJson) => salon.fromJson(itemJson as Map<String, dynamic>))
          .toList();
      return items;
    } catch (e) {
      throw Exception('Failed to get items: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding:
              EdgeInsets.symmetric(horizontal: getProportionateScreenWidth(20)),
          child: SectionTitle(
            title: "Special pour vous",
            press: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => seeMoreCentre()),
              );
            },
          ),
        ),
        SizedBox(height: getProportionateScreenWidth(13)),
        FutureBuilder<List<salon>>(
          future: getItems(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(
                child: CircularProgressIndicator(),
              );
            } else if (snapshot.hasError) {
              return Center(
                child: Text('Error: ${snapshot.error}'),
              );
            } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return const Center(
                child: Text('No data available.'),
              );
            } else {
              final salons = snapshot.data!;
              final visibleSalons =
                  salons.take(4).toList(); // Limiter les salons à 4
              return SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: visibleSalons.map((salon) {
                    return SpecialOfferCard(
                      imageBytes: salon.src,
                      category: salon.nom,
                      numOfBrands: salon.type,
                      press: () {
                        Navigator.pushNamed(
                          context,
                          DetailsScreen.routeName,
                          arguments: salonDetailsArguments(
                              reference: salon.reference, nomCentre: salon.nom),
                        );
                      },
                    );
                  }).toList(),
                ),
              );
            }
          },
        ),
      ],
    );
  }
}

class SpecialOfferCard extends StatelessWidget {
  const SpecialOfferCard(
      {Key? key,
      required this.category,
      required this.numOfBrands,
      required this.press,
      required this.imageBytes})
      : super(key: key);
  final Uint8List imageBytes;
  final String category;
  final String numOfBrands;
  final GestureTapCallback press;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(left: getProportionateScreenWidth(20)),
      child: GestureDetector(
        onTap: press,
        child: SizedBox(
          width: getProportionateScreenWidth(230),
          height: getProportionateScreenWidth(140),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(15),
            child: Stack(
              children: [
                Image.memory(
                  imageBytes,
                  fit: BoxFit.cover,
                  width: 400,
                ),
                Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Color(0xFF343434).withOpacity(0.4),
                        Color(0xFF343434).withOpacity(0.15),
                      ],
                    ),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.symmetric(
                    horizontal: getProportionateScreenWidth(15.0),
                    vertical: getProportionateScreenWidth(15),
                  ),
                  child: Text.rich(
                    TextSpan(
                      style: TextStyle(color: Colors.white),
                      children: [
                        TextSpan(
                          text: "$category\n",
                          style: TextStyle(
                            fontSize: getProportionateScreenWidth(18),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        TextSpan(text: "$numOfBrands")
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
