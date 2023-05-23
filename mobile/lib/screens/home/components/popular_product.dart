import 'package:flutter/material.dart';

import '../../../components/service_menu.dart';
import '../../../size_config.dart';
import 'section_title.dart';

class PopularProducts extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding:
              EdgeInsets.symmetric(horizontal: getProportionateScreenWidth(20)),
          child: SectionTitle(title: "Nos services ", press: () {}),
        ),
        SizedBox(height: getProportionateScreenWidth(10)),
        SingleChildScrollView(
          child: Column(
            children: [
              ServiceMenu(
                text: "Coupe cheveux",
                heure: "1h",
                prix: "30 D",
                press: () => {},
              ),
              ServiceMenu(
                text: "Coloration",
                heure: "30min",
                prix: "20 D",
                press: () {},
              ),
              ServiceMenu(
                text: "Maquillage",
                heure: "45min",
                prix: "45 D",
                press: () {},
              ),
            ],
          ),
        )
      ],
    );
  }
}
