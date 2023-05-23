import 'package:flutter/material.dart';

import '../constants.dart';
import '../size_config.dart';

class buttonSplash extends StatelessWidget {
  const buttonSplash({
    Key? key,
    this.text,
    this.press,
    this.color,
    this.bgcolor,
  }) : super(key: key);
  final String? text;
  final Function? press;
  final Color? color;
  final Color? bgcolor;
  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: Align(
            alignment: Alignment.center,
            child: SizedBox(
              width: 230,
              height: 40,
              child: TextButton(
                style: TextButton.styleFrom(
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10)),
                  primary: color!,
                  backgroundColor: bgcolor!,
                ),
                onPressed: press as void Function()?,
                child: Text(
                  text!,
                  style: TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: getProportionateScreenWidth(13),
                    color: color!,
                  ),
                ),
              ),
            )));
  }
}
