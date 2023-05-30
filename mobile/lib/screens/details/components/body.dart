import 'package:flutter/material.dart';
import 'package:shop_app/screens/details/components/head.dart';
import 'package:shop_app/size_config.dart';
import 'product_description.dart';
import 'product_images.dart';

class Body extends StatelessWidget {
  final int reference;
  final String nomCentre;

  const Body({Key? key, required this.reference, required this.nomCentre})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
        length: 3,
        child: Scaffold(
            appBar: PreferredSize(
              preferredSize: const Size.fromHeight(90.0),
              child: AppBar(
                backgroundColor: Colors.white,
                centerTitle: true,
                elevation: 3,
                bottom: const TabBar(
                    indicatorColor: Colors.black,
                    indicatorWeight: 1,
                    tabs: [
                      Tab(
                        child: Text('Prendre RDV',
                            style: TextStyle(color: Colors.black)),
                      ),
                      Tab(
                        child:
                            Text('Avis', style: TextStyle(color: Colors.black)),
                      ),
                      Tab(
                        child: Text('A propos',
                            style: TextStyle(color: Colors.black)),
                      )
                    ]),
                title: const Text(
                  "CLASSY",
                  style: TextStyle(
                      color: Color.fromARGB(255, 15, 15, 15), fontSize: 14),
                ),
                leading: IconButton(
                  icon: const Icon(
                    Icons.arrow_back_ios_new,
                    color: Colors.black,
                    size: 14,
                  ),
                  onPressed: () {
                    Navigator.pop(context);
                  },
                ),
              ),
            ),
            body: TabBarView(
              children: [
                buildPageRes(MediaQuery.of(context).size.width),
                buildPageAvis(),
                buildPageProp(),
              ],
            )));
  }

  Widget buildPageAvis() => Scaffold();
  Widget buildPageProp() => Scaffold();

  Widget buildPageRes(width) => ListView(
        children: [
          Container(
            color: Color.fromARGB(100, 236, 236, 236),
            child: Column(
              children: [
                head(reference: reference, nomCentre: nomCentre),
                SizedBox(height: 5),
                ProductImages(reference: reference),
                ProductDescription(
                  reference: reference,
                  nomCentre: nomCentre,
                  pressOnSeeMore: () {},
                ),
                Container(
                  color: const Color(0xFFF6F7F9),
                  child: Column(
                    children: [
                      Container(
                        color: Colors.white,
                        child: Padding(
                          padding: EdgeInsets.only(
                            left: SizeConfig.screenWidth * 0.15,
                            right: SizeConfig.screenWidth * 0.15,
                            bottom: getProportionateScreenWidth(40),
                            top: getProportionateScreenWidth(15),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      );
}
