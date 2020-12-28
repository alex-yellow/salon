lp_template.queue.fpInit = function($self) {
	var $block = $self.find('.js-lp-fastpay');

	if ($block.length) {

		$block.on('click', '.js-fp-show-form', function(e) {
			e.preventDefault();

			var $this = $(this),
				$parent = $this.closest('.js-lp-fastpay'),
				needHref = $parent.data('page-path'),
				serviceID = $this.data('service-id'),
				fastPayID = $this.closest('.lp-payment-service-item').attr('data-fastpay-id');


			$.ajax({
				url: '/my/s3/xapi/public/?method=fastpay/getService&param[service_id]='+serviceID+'&param[fast_pay_id]='+ fastPayID +'&param[tpl]=global:lp.fast_payment.tpl',
				success: function(data) {
					var htmlForm = data.result.html;
					var $newBlock = $this.closest('.lp-payment-service-item').append(htmlForm);
					s3LP.initForms($newBlock);
					$this.closest('.lp-payment-service-item').find('.lp-payment-service-item_button').hide();
					var needAttr = $self.find('.lp-payment__form').attr('data-api-url') + "&param[href]=" + needHref;
					$newBlock.find('.lp-payment__form').attr('data-api-url', needAttr);
				}
			});
		});

		$block.find('.fp_free_wrap').each(function() {
			var $this = $(this).find('.js-lp-fp-form'),
				$parent = $this.closest('.js-lp-fastpay'),
				needHref = $parent.data('page-path'),
				needAttr = $this.attr('data-api-url') + "&param[href]=" + needHref;
	
			$this.attr('data-api-url', needAttr);
	
		});
	}
}