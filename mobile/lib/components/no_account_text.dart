import 'package:flutter/material.dart';
import 'package:shop_app/screens/sign_up/sign_up_screen.dart';

import '../constants.dart';
import '../size_config.dart';

class NoAccountText extends StatelessWidget {
  const NoAccountText({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          "Nouveau sur Classy ?   ",
          style: TextStyle(
              fontSize: getProportionateScreenWidth(15), fontFamily: "Times"),
        ),
        GestureDetector(
          onTap: () => Navigator.pushNamed(context, SignUpScreen.routeName),
          child: Text(
            "S'inscrire",
            style: TextStyle(
                fontFamily: "Times",
                fontSize: getProportionateScreenWidth(15),
                color: Colors.black),
          ),
        ),
      ],
    );
  }
}
