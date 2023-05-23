import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../../size_config.dart';

class Categories extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    List<Map<String, dynamic>> categories = [
      {"icon": "razor.png", "text": "Barber"},
      {"icon": "salon.png", "text": "Coiffure"},
      {"icon": "make-up.png", "text": "Institut"},
      {"icon": "facial.png", "text": "Soin"},
      {"icon": "nail-polish.png", "text": "Manucure"},
    ];
    return Padding(
      padding: EdgeInsets.all(getProportionateScreenWidth(22)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: List.generate(
          categories.length,
          (index) => CategoryCard(
            icon: categories[index]["icon"],
            text: categories[index]["text"],
            press: () {},
          ),
        ),
      ),
    );
  }
}

class CategoryCard extends StatelessWidget {
  const CategoryCard({
    Key? key,
    required this.icon,
    required this.text,
    required this.press,
  }) : super(key: key);

  final String? icon, text;
  final GestureTapCallback press;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: press,
      child: SizedBox(
        width: getProportionateScreenWidth(54),
        child: Column(
          children: [
            Container(
              padding: EdgeInsets.all(getProportionateScreenWidth(10)),
              height: getProportionateScreenHeight(70),
              width: getProportionateScreenWidth(70),
              decoration: BoxDecoration(
                color: Color.fromARGB(246, 13, 13, 13),
                borderRadius: BorderRadius.circular(50),
              ),
              child: Image.asset(
                icon!,
                color: Color.fromARGB(255, 244, 228, 228),
              ),
            ),
            SizedBox(height: 5),
            Text(text!, textAlign: TextAlign.center)
          ],
        ),
      ),
    );
  }
}
