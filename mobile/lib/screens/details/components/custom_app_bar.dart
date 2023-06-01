import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:shop_app/constants.dart';

import '../../../size_config.dart';

class CustomAppBar extends StatelessWidget {
  final double rating;

  CustomAppBar({required this.rating});

  @override
  // AppBar().preferredSize.height provide us the height that appy on our app bar
  Size get preferredSize => Size.fromHeight(AppBar().preferredSize.height);

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding:
            EdgeInsets.symmetric(horizontal: getProportionateScreenWidth(20)),
        child: Row(
          children: [
            Row(
              children: List.generate(rating.floor(), (index) {
                return Icon(
                  Icons.star,
                  color: Colors.black,
                  size: 14,
                );
              }),
            ),
            if (rating - rating.floor() >
                0) // Afficher une demi-étoile si le rating est décimal
              Icon(
                Icons.star_half,
                color: Colors.black,
                size: 14,
              ),
            Text(
              " $rating avis",
              style: TextStyle(fontSize: 12),
            )
          ],
        ),
      ),
    );
  }
}
