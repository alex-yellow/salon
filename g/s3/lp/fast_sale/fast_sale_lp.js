$(function(){
	var $wrapper = $('.lp-fast-sale'),
		$mainPaymentWrapType1 = $('.payment-page-main-wrap'),
		$mainPaymentWrapType2 = $('[data-block-layout]').find('.fp_free_wrap'),
		needHref = $wrapper.data('pagePath');
	
	$mainPaymentWrapType1.each(function(){
		var $self = $(this),
			fastPayID = $self.find('.payment_block').attr('data-fastpay-id');
		
		$self.on('click', '.to-form, .to-form a', function(e) {
			e.preventDefault();
			var $this = $(this),
				serviceID = $this.attr('href').split('&').filter(function(item){
					if (item.indexOf('service_id') > -1) {
						return item;
					}
				})[0].split('=')[1];
				
			$.ajax({
              	url: '/my/s3/xapi/public/?method=fastpay/getService&param[service_id]='+serviceID+'&param[fast_pay_id]='+ fastPayID +'&param[tpl]=global:fast_pay_block.tpl',
              	success: function(data) {
					var htmlForm = data.result.html;
					$self.html(htmlForm);
					s3LP.initForms();
					var needAttr = $self.find('.tpl-anketa').attr('data-api-url') + "&param[href]=" + needHref;
					$self.find('.tpl-anketa').attr('data-api-url', needAttr);
		        }
	        });
		});
	});
	
	if ($mainPaymentWrapType2.length) {
		console.log($mainPaymentWrapType2);

		$mainPaymentWrapType2.each(function() {
			var $self = $(this).find('.tpl-anketa'),
				needAttr = $self.attr('data-api-url') + "&param[href]=" + needHref;
	
			$self.attr('data-api-url', needAttr);
	
		});
	
	}
})