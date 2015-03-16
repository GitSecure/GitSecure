var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

describe('parsing service', function() {
  describe('parsing API Keys object', function(){
    it('should have sample keys for targeted sites', function(){
       APIKeys.should.have.property('twitter');
       APIKeys.should.have.property('stripe');
       APIKeys.should.have.property('google');
       APIKeys.should.have.property('ebay');
       APIKeys.should.have.property('paypal');
       APIKeys.should.have.property('azure');
    });
  });
  describe('parsing API Regexes', function() {
    it('should have regexes for targeted keys', function() {
      APIRegexes.should.have.property('twitter');
      APIRegexes.should.have.property('stripe');
      APIRegexes.should.have.property('google');
      APIRegexes.should.have.property('ebay');
      APIRegexes.should.have.property('paypal');
      APIRegexes.should.have.property('azure');
    });
  });
  describe('findAPIKey function', function() {
    var successText = {
      'twitter': 'Etiam lacinia est vel odio XZY3ZAyRzem613wcfFsCWqnA3 dictum, ut commodo mi porttitor. In quis bibendum ligula. Nunc eleifend tellus nec tortor luctus, non dapibus nulla sollicitudin. Suspendisse tortor turpis, condimentum in orci in, bibendum pretium orci. Nam sit amet nunc quis nulla laoreet convallis. Nullam pellentesque mollis risus in imp',
      'stripe':'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut sk_live_FgV3tzZsHXbpDHn1tXeNxxxx odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
      'google':'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique AIzaSyDRhpkQmqUbkJQpW73P_JkZK5kqNOYqjps sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
      'ebay': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non molestie turpis, eget sollicitudin arcu. Nam nulla magna, tincidunt feugiat odio a, euismod aliquet libero. Pellentesque interdum lacinia volutpat. Integer ut mollis nisi. Vivamus at sem ac lacus dapibus finibus. Vestibulum efficitur, justo non fringilla semper, eros urna commodo eros, ut volutpat lectus velit at nisl. In bibendum tempor orci at dictum. In feugiat dolor dapibus gravida consequat. Sed ullamcorper tristique purus nec iaculis. Aenean non orci nisi.',
      'paypal': 'Integer tempor neque eu orci vulputate, vel molestie risus luctus. Nulla ac neque vitae velit suscipit convallis eu ut justo. Morbi mattis velit vehicula mi iaculis commodo. Duis posuere lacinia scelerisque. Ut facilisis velit tortor, at consectetur diam dictum eget. Vivamus eget velit sit amet ipsum semper tristique. Sed vehicula pretium erat quis pellentesque. Morbi placerat egestas mi, in imperdiet leo accumsan sit amet.',
      'azure': ' Proin egestas auctor AfKnZYWmF4q.r.Qj2YUl2OFgCfgab0wCfwV2VggD6e0-@ds050077.mongolab.com:50077/deploy-shortlyDB neque schandrasekaran-us_api1.paypal.com nec faucibus. Quisque vulputate enim urna, nec vestibulum enim sollicitudin nec. Pellentesque nec tempor ligula. Donec gravida aliquam felis, vitae luctus neque convallis non. Duis leo diam, imperdiet sit amet maximus ut, tempor id purus. Nullam iaculis vel nisl vel fermentum. Integer vitae purus aliquam, mollis est vitae, vehicula ante.'
    };

    var failText = {
      'twitter': 'Etiam lacinia est vel odio XZY3ZAyRzem613wcfFsCWqnA3 dictum, ut commodo mi porttitor. In quis bibendum ligula. Nunc eleifend tellus nec tortor luctus, non dapibus nulla sollicitudin. Suspendisse tortor turpis, condimentum in orci in, bibendum pretium orci. Nam sit amet nunc quis nulla laoreet convallis. Nullam pellentesque mollis risus in imp',
      'stripe':'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut sk_live_FgV3tzZsHXbpDHn1tXeNxxxx odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
      'google':'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique AIzaSyDRhpkQmqUbkJQpW73P_JkZK5kqNOYqjps sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
      'ebay': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non molestie turpis, eget sollicitudin arcu. Nam nulla magna, tincidunt feugiat odio a, euismod aliquet libero. Pellentesque interdum lacinia volutpat. Integer ut mollis nisi. Vivamus at sem ac lacus dapibus finibus. Vestibulum efficitur, justo non fringilla semper, eros urna commodo eros, ut volutpat lectus velit at nisl. In bibendum tempor orci at dictum. In feugiat dolor dapibus gravida consequat. Sed ullamcorper tristique purus nec iaculis. Aenean non orci nisi.',
      'paypal': 'Integer tempor neque eu orci vulputate, vel molestie risus luctus. Nulla ac neque vitae velit suscipit convallis eu ut justo. Morbi mattis velit vehicula mi iaculis commodo. Duis posuere lacinia scelerisque. Ut facilisis velit tortor, at consectetur diam dictum eget. Vivamus eget velit sit amet ipsum semper tristique. Sed vehicula pretium erat quis pellentesque. Morbi placerat egestas mi, in imperdiet leo accumsan sit amet.',
      'azure': ' Proin egestas auctor AfKnZYWmF4q.r.Qj2YUl2OFgCfgab0wCfwV2VggD6e0-@ds050077.mongolab.com:50077/deploy-shortlyDB neque schandrasekaran-us_api1.paypal.com nec faucibus. Quisque vulputate enim urna, nec vestibulum enim sollicitudin nec. Pellentesque nec tempor ligula. Donec gravida aliquam felis, vitae luctus neque convallis non. Duis leo diam, imperdiet sit amet maximus ut, tempor id purus. Nullam iaculis vel nisl vel fermentum. Integer vitae purus aliquam, mollis est vitae, vehicula ante.'
    };

    it('should successfull find API keys', function() {
      expect(APIRegexes.twitter.exec(successText.twitter).to.have.property('length'));
      expect(APIRegexes.stripe.exec(successText.stripe).to.have.property('length'));
      expect(APIRegexes.google.exec(successText.google).to.have.property('length'));
      expect(APIRegexes.ebay.exec(successText.ebay).to.have.property('length'));
      expect(APIRegexes.paypal.exec(successText.paypal).to.have.property('length'));
      expect(APIRegexes.azure.exec(successText.azure).to.have.property('length'));
     
    });
    it('should fail to find non-existent API keys', function() {
      assert.equal(APIRegexes.twitter.exec(failText.twitter), null);
      assert.equal(APIRegexes.stripe.exec(failText.stripe), null);
      assert.equal(APIRegexes.google.exec(failText.google), null);
      assert.equal(APIRegexes.ebay.exec(failText.ebay), null);
      assert.equal(APIRegexes.paypal.exec(failText.paypal), null);
      assert.equal(APIRegexes.azure.exec(failText.azure), null);
    });
  });
  describe('Result Decorator', function() {
    it('should add properties to object', function() {
      var testRegex = /a/;
      var testObj = {};
      organizeHitData(testObj, testRegex, 5, 'matched!');
      testObj.should.have.property('regex');
      testObj.should.have.property('index');
      testObj.should.have.property('match');
      assert.equal(testObj.regex, testRegex); //do identical regex evalaute true?
      assert.equal(testObj.index, 5);
      assert.equal(testObj.match, 'matched!');
    });
  });
});


